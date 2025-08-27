
/**
 * @typedef {Object} TextChunk
 * @property {{ current: string, previous: string, next: string }} textValues
 * @property {string} voice
 * @property {number} index
 */

function buildTextChunks(text ) {

  const textChunks = []

  // . When a chunk exceeds 250 chars, it'll start a new chunk
  const chunks = chunkTextBySentence(text, 250);

  for (let i = 0; i < chunks.length; i++) {
    Logger.log(i+" : "+chunks[i]);

    let textValues = {
      current: chunks[i],
      previous: i > 0 ? chunks[i - 1] : null,
      next: i < chunks.length - 1 ? chunks[i + 1] : null
    }
    textChunks.push({
      textValues: textValues,
      index: i
    });
  }
  
  // always return an array of chunks
  return textChunks;
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
  const sentenceRegex = /[^.!?]+[.!?]["'”’]*\s*|[^.!?]+$/g;
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