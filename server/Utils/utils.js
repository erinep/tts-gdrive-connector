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

function normalizeText(text) {
  return text
    .normalize("NFKC") // Normalize Unicode (e.g. curly quotes, accented chars)
    .replace(/[“”«»]/g, '"') // Replace smart double quotes with straight
    .replace(/[‘’]/g, "'")   // Replace smart single quotes with straight
    .replace(/\u00A0/g, " ") // Replace non-breaking spaces with regular
    .replace(/\s+/g, " ")    // Collapse multiple spaces/tabs/newlines
    .replace(/—/g, '-')               // Em dash → hyphen
    .replace(/…/g, '...')             // Ellipsis → three dots
    .replace(/\s+/g, ' ')             // Collapse whitespace
    .trim();
}

function chunkTextBySentence(text, maxLength = 1000) {

  const normalizedText = normalizeText(text);
  if (normalizedText.length <= maxLength) {
    return [normalizedText];
  }

  // Break text into sentences by matching:
  // - one or more non-punctuation characters
  // - followed by punctuation (., !, or ?)
  // - followed by optional quotes
  // - followed by whitespace or end of string
  const sentenceRegex = /[^.!?]+[.!?]["'”’]*\s*/g;
  const sentences = normalizedText.match(sentenceRegex) || [normalizedText]; 
  
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

function audioFileName(voice, index){
  const d = getDocFileName().replace(/[^a-zA-Z0-9]/g, '');
  const timestamp = new Date().toISOString().slice(2,19).replace(/\D/g,'')
  const filename = `${timestamp}_Chunk${String(index).padStart(2, '0')}.mp3`;
  return filename
}