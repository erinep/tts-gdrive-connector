
/**
 * @typedef {Object} SessionMetadata
 * @property {string} sessionId
 * @property {string} voice
 * @property {string} provider
 * @property {string} gdoc_details
 * @property {number} audioChunkCount
 *
 * @param {SessionMetadata} metadata
 * @return
*/
function writeSessionToFirestore({ sessionId, voice, provider, gdoc_details, audioChunkCount }) {
  const token = getAccessTokenFromServiceAccount();
  const projectId = PropertiesService.getScriptProperties().getProperty("PROJECT_ID");
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${sessionId}/metadata`;

  const payload = {
    fields: {
      voice: { stringValue: voice },
      provider: { stringValue: provider },
      gdoc_details: { stringValue: gdoc_details },
      totalChunks: { integerValue: audioChunkCount.toString() },
      created: { timestampValue: new Date().toISOString() }
    }
  };

  let response = UrlFetchApp.fetch(url, {
    method: 'patch',
    contentType: 'application/json',
    headers: { Authorization: `Bearer ${token}` },
    payload: JSON.stringify(payload)
  });
  Logger.log(response.getContentText());
}

/** 
 * @typedef {Object} ChunkMetadata
 * @property {number} index
 * @property {string} text
 * @property {string} bucket
 * @property {string} filename
 * @property {string} sessionId
 *
 * @param {ChunkMetadata} audio
 * @return
 */
function writeChunkToFirestore( audio) {
  const token = getAccessTokenFromServiceAccount();
  const projectId = PropertiesService.getScriptProperties().getProperty("PROJECT_ID");
  const chunkId = `Chunk_${String(audio.index).padStart(2, "0")}`;
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${audio.sessionId}/${chunkId}`;

  const payload = {
    fields: {
      text: { stringValue: audio.text },
      chunk_index: { integerValue: audio.index.toString() },
      created: { timestampValue: new Date().toISOString() },
      bucket: { stringValue: audio.bucket },
      filename: { stringValue: audio.filename }
      }
    }

  UrlFetchApp.fetch(url, {
    method: 'patch',
    contentType: 'application/json',
    headers: { Authorization: `Bearer ${token}` },
    payload: JSON.stringify(payload)
  });
}
