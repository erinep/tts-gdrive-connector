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
  let now = new Date();
  let timezone = Session.getScriptTimeZone();
  return Utilities.formatDate(now, timezone, "yy-MM-dd_HH:mm:ss");
}

function createSessionID(){
  return "session_" + getTimeString();
}

function audioFileName(index){
  const d = getDocFileName().replace(/[^a-zA-Z0-9]/g, '');
  const timestamp = getTimeString();
  // @ts-ignore
  const filename = `${timestamp}_Chunk${String(index).padStart(2, '0')}.mp3`;
  return filename
}