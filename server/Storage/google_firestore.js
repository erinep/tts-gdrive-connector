
/**
 * @typedef {Object} SessionMetadata
 * @property {string} sessionId
 * @property {string} voiceId
 * @property {string} voiceName
 * @property {string} provider
 * @property {string} gdoc_details
 * @property {number} audioChunkCount
 * @property {string} [chapter_name]
 *
 * @param {SessionMetadata} metadata
 * @return
*/
function writeSessionToFirestore({ sessionId, voiceId, voiceName, provider, gdoc_details, audioChunkCount }) {
  const token = getAccessTokenFromServiceAccount();
  const projectId = PropertiesService.getScriptProperties().getProperty("PROJECT_ID");
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/sessions/${sessionId}`;

  const payload = {
    fields: {
      voiceId: { stringValue: voiceId },
      voiceName: { stringValue: voiceName},
      provider: { stringValue: provider },
      gdoc_details: { stringValue: gdoc_details },
      totalChunks: { integerValue: audioChunkCount.toString() },
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
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/sessions/${audio.sessionId}/chunks/${chunkId}`;

  const payload = {
    fields: {
      text: { stringValue: audio.text },
      index: { integerValue: audio.index.toString() },
      bucket: { stringValue: audio.bucket },
      filename: { stringValue: audio.filename }
      }
    }

  const response = UrlFetchApp.fetch(url, {
    method: 'patch',
    contentType: 'application/json',
    headers: { Authorization: `Bearer ${token}` },
    payload: JSON.stringify(payload)
  });
  Logger.log(response.getContentText());
}


/**
 * 
 * @param {string} sessionId 
 * @returns {ChunkMetadata[]}
 */
function getFirestoreChunks(sessionId) {
  const projectId = PropertiesService.getScriptProperties().getProperty("PROJECT_ID");
  const accessToken = getAccessTokenFromServiceAccount();
  
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/sessions/${sessionId}/chunks`;
  
  const options = {
    method: 'get',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    muteHttpExceptions: true,
  };
  
  const response = UrlFetchApp.fetch(url, options);
  const statusCode = response.getResponseCode();
  
  if (statusCode === 200) {
    const json = JSON.parse(response.getContentText());
    
    if (json.documents){
      return json.documents.map(d => ({
        ...cleanAudioChunkMetadata(d.fields),
        sessionId: sessionId,
      }))
    }
    throw new Error (`no documents found in the session`);
  } else  {
    throw new Error (`message: ${response.getContentText()}`)
  }
}

/**
 * 
 * @param {{filename: object, index: object, bucket: object, text: object}} rawChunk 
 */
function cleanAudioChunkMetadata(rawChunk) {
  return {
    filename: rawChunk.filename.stringValue,
    index: rawChunk.index.integerValue,
    bucket: rawChunk.bucket.stringValue,
    text: rawChunk.text.stringValue,
  }
}

/**
 * @returns {SessionMetadata[]} - return all sessions with chapter_name fields
 */
function getFirestoreSession_Chapter_Names() {
  const projectId = PropertiesService.getScriptProperties().getProperty("PROJECT_ID");
  const accessToken = getAccessTokenFromServiceAccount();
  
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/sessions/`;
  
  const options = {
    method: 'get',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    muteHttpExceptions: true,
  };
  
  const response = UrlFetchApp.fetch(url, options);
  const statusCode = response.getResponseCode();
  
if (statusCode !== 200) {
  throw new Error(`message: ${response.getContentText()}`);
}

const json = JSON.parse(response.getContentText());

if (!json.documents) {
  throw new Error(`No documents found in sessions`);
}

return json.documents
  .filter(doc => doc.fields?.chapter_name?.stringValue)
  .map(doc => ({
    sessionId: doc.name.split('/').pop(),
    chapter_name: doc.fields.chapter_name.stringValue
  }));

}