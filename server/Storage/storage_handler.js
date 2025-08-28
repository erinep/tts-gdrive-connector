/**
 * @param {AudioChunksSession} data
 * @param {string} SERVICE_FOR_STORAGE 
 * @returns {{message: string, sessionId?: string, file_url?: string, file_name?: string}}
 */
function audioStorageHandler( data, SERVICE_FOR_STORAGE) {

  if (!data || data.audioChunkCount === 0) throw new Error("No audio chunks found.");

  if (SERVICE_FOR_STORAGE === "drive") return addBase64ToDrive(data.audioChunks);
  if (SERVICE_FOR_STORAGE === "gcs"){

    const savedFiles = [];

    writeSessionToFirestore({
      sessionId: data.sessionId,
      voiceId: data.voiceId,
      voiceName: data.voiceName,
      provider: data.provider,
      gdoc_details: data.gdoc_details,
      audioChunkCount: data.audioChunkCount,
    });

    for (let chunk of data.audioChunks) {
      const cleanedBase64 = chunk.base64.includes(',') ? chunk.base64.split(',')[1] : chunk.base64;

      const name = audioFileName(chunk.index);
      const res = uploadBase64ToGCS(cleanedBase64, name);
      savedFiles.push(res)

      writeChunkToFirestore({
        sessionId: data.sessionId,
        bucket: res.bucketName,
        filename: res.objectName,
        index: chunk.index,
        text: chunk.text
      });
    }

    return { 
      message: `Saved ${savedFiles.length} audio chunk(s) to Google Cloud.`,
      sessionId: data.sessionId,
    }
  };

  throw new Error('No storage method selected.');
}

function getSession(sessionId){
  const chunks = getFirestoreChunks(sessionId)
  Logger.log(chunks);
  const audio = []
  for (let chunk of chunks) {
    audio.push({
      ...downloadFileFromGCS(chunk.filename),
      text: chunk.text,
      index: chunk.index
    });
  }
  return audio.sort((a,b) => a.index - b.index);
}