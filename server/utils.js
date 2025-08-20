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

function chunkTextBySentence(text, maxLength = 1000) {
  const sentences = text.match(/[^.!?]+[.!?]+(?:\s+|$)/g) || [text];
  let chunks = [];
  let current = "";

  for (let sentence of sentences) {
    if ((current + sentence).length > maxLength) {
      if (current.length > 0) chunks.push(current.trim());
      current = sentence;
    } else {
      current += sentence;
    }
  }
  if (current.trim().length > 0) chunks.push(current.trim());
  return chunks;
}
