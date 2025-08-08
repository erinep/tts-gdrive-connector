function appendToCueFile(newAudio) {
  const CUE_FILENAME = `cue-${getDocFileName}.json`;
  const folder = getOrCreateAppFolder()
  let cueFile;
  let cueData = [];

  // Try to find the existing cue file
  const files = folder.getFilesByName(CUE_FILENAME);
  if (files.hasNext()) {
    cueFile = files.next();
    const content = cueFile.getBlob().getDataAsString();
    try {
      cueData = JSON.parse(content);
    } catch (e) {
      Logger.log('Failed to parse cue file, starting fresh.');
      cueData = [];
    }
  }

  cueData.push({
    id: newAudio.id,
    filename: newAudio.filename,
    timestamp: newAudio.timestamp || new Date().toISOString()
  });

  const updatedContent = JSON.stringify(cueData, null, 2);

  if (cueFile) {
    cueFile.setContent(updatedContent);
  } else {
    folder.createFile(CUE_FILENAME, updatedContent, MimeType.JSON);
  }

  Logger.log('Cue file updated.');
}
