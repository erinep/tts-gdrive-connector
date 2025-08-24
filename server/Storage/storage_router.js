
function audioStorageHandler(audioChunks, SERVICE_FOR_STORAGE) {
  if (!audioChunks || audioChunks.length === 0) throw new Error("No audio chunks found.");

  if (SERVICE_FOR_STORAGE === "drive") return addBase64ToDrive(audioChunks);
  if (SERVICE_FOR_STORAGE === "gcs"){

    const savedFiles = [];

    for (let chunk of audioChunks) {
      const cleanedBase64 = chunk.base64.includes(',') ? chunk.base64.split(',')[1] : chunk.base64;

      const name = audioFileName(chunk.voice, chunk.index);
      savedFiles.push(uploadBase64ToGCS(cleanedBase64, name));
    }

    const url = getSignedUrl(savedFiles[0].bucketName, savedFiles[0].objectName, 15 * 60);
    return {
      message: `Saved ${savedFiles.length} audio chunk(s) to Google Cloud.`,
      file_url: url,
      file_name: "downaload file",
    };
  };

  throw new Error('No storage method selected.');
}