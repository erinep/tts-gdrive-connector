/// server/utils.js
/**
 * Utility functions for the server-side Google Apps Script.
 * These functions include HTML file creation, base64 encoding of blobs
 * and formatting date strings.
 */

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

function toBase64Obj(blob) {
  if (blob.getContentType() !== "audio/mpeg") {
    Logger.log(blob);
    throw new Error ("CONTENT TYPE ERROR: "+ blob.getContentType())
  }
  
  const base64 = Utilities.base64Encode(blob.getBytes());
  const contentType = blob.getContentType();
  return {
    base64,
    contentType
  };
}

function getTimeString() {
  const now = new Date();
  const timezone = Session.getScriptTimeZone(); // Use your script's timezone
  return Utilities.formatDate(now, timezone, 'HH:mm:ss');
}


function audioFileName(voice, index){
  const d = getDocFileName().replace(/[^a-zA-Z0-9]/g, '');
  const timestamp = new Date().toISOString().slice(2,19).replace(/\D/g,'')
  // @ts-ignore
  const filename = `${timestamp}_Chunk${String(index).padStart(2, '0')}.mp3`;
  return filename
}