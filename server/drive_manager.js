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

function audioFileName(metaData){
  const d = getDocFileName().replace(/[^a-zA-Z0-9]/g, '');
  const filename = `${d.substring(0,4)}_${metaData.voice.substring(0,10)}_${getTimeString()}.mp3`;
  return filename
}

function addBase64ToDrive(base64Obj, metaData) {
  const filename = audioFileName(metaData);

  try {
    const { base64, contentType } = base64Obj;
    const cleanedBase64 = base64.includes(',') ? base64.split(',')[1] : base64;
    const decodedBytes = Utilities.base64Decode(cleanedBase64);
    const blob = Utilities.newBlob(decodedBytes, contentType, filename);

    const folder = getOrCreateAppFolder()
    const file = folder.createFile(blob);
    const msg = `File saved to '${SERVICE_FOLDER_NAME}' folder in GDrive`;
    return {"message": msg, "file_url": file.getUrl(), "file_name": filename};

  } catch (e) {
    Logger.log("Error storing audio: " + e.toString());
    throw new Error("Failed to store audio.");
  }
}