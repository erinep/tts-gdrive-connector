const SERVICE_FOLDER_NAME = "text_to_speech"


function getDocFileName() {
  const fileName = DocumentApp.getActiveDocument().getName();
  return fileName;
}

function getOrCreateAppFolder() {
  let folderId = PropertiesService.getUserProperties().getProperty('appFolderId');
  Logger.log("UserPropery `appFolderId` is " + folderId)

  if (folderId) {
    try {
      return DriveApp.getFolderById(folderId);
    } catch (e) {
      // Folder not found or no access — clear property
      Logger.log("folder not found. Deleting UserProperty `appFolderId` "); 
      PropertiesService.getUserProperties().deleteProperty('appFolderId');
    }
  }
  
  Logger.log("Creating new folder...")
  const folder = DriveApp.createFolder(SERVICE_FOLDER_NAME);
  PropertiesService.getUserProperties().setProperty('appFolderId', folder.getId());
  Logger.log("UserPropery `appFolderId` is " + folderId)
  return folder;
  
}

function buildHistoryJSON(audioChunks, files){
  const sessionId = new Date().toISOString().replace(/[:.]/g, "-");
  const history = {
    session_id: sessionId,
    created_at: new Date().toISOString(),
    provider: audioChunks?.provider || "unknown",
    voice: audioChunks[0]?.voice || "unknown",
    speed: audioChunks[0]?.speed || "1x",
    locale: audioChunks[0]?.locale || "en-US",
    chunks: files.map((file, i) => ({
      index: file.index,
      text: audioChunks[i].text,
      file_name: file.file_name,
      file_url: file.file_url,
      size: `${Utilities.newBlob(Utilities.base64Decode(audioChunks[i].base64)).getBytes().length} bytes`
    })),
  };
  return history;
}


function addBase64ToDrive(audioChunks) {
  const rootFolder = getOrCreateAppFolder();
  const sessionfolder = rootFolder.createFolder(`Session_${new Date().toISOString()}`);
  const savedFiles = [];

  for (let chunk of audioChunks) {
    try {
      const { base64, contentType, voice, index } = chunk;
      const cleanedBase64 = base64.includes(',') ? base64.split(',')[1] : base64;
      const decodedBytes = Utilities.base64Decode(cleanedBase64);
      
      const filename = audioFileName(voice, index);

      const blob = Utilities.newBlob(decodedBytes, contentType, filename);
      const file = sessionfolder.createFile(blob);

      savedFiles.push({
        file_name: file.getName(),
        file_url: file.getUrl(),
        index: index
      });
      
    } catch (e) {
      Logger.log(`Failed to save chunk ${chunk.index}: ${e}`);
      throw new Error(`Failed to store audio chunk ${chunk.index}`);
    }
  }
  // Save history to a JSON file in the same folder
  const h = buildHistoryJSON(audioChunks, savedFiles);
  const historyBlob = Utilities.newBlob(JSON.stringify(h, null, 2), 'application/json', 'history.json');
  sessionfolder.createFile(historyBlob);
  
  return {
    message: `Saved ${savedFiles.length} audio chunk(s) to Drive.`,
    file_url: sessionfolder.getUrl(),
    file_name: sessionfolder.getName(),
  };
}
