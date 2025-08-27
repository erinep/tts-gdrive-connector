function getCurrentService() {
  let service = PropertiesService.getUserProperties().getProperty('current-service');
  if (!service) service = "google-tts"; //fallback
  return service
}

function setCurrentService(value) {
  if (value === "eleven_labs") PropertiesService.getUserProperties().setProperty('current-service', 'eleven_labs');
  else if (value === "google-tts") PropertiesService.getUserProperties().setProperty('current-service', 'google-tts');
  else throw new Error("service id '" + value + "' not found.");
}


/**
 * @typedef {Object} AudioChunksSession
 * @property {string} sessionId - Unique ID for the session.
 * @property {string} provider - TTS provider (e.g., "google-tts", "eleven_labs").
 * @property {string} voice - Voice ID used for the session.
 * @property {string} gdoc_details - Source Google Doc name or ID.
 * @property {number} audioChunkCount - Total number of audio chunks.
 * @property {AudioChunk[]} audioChunks - Array of audio chunk objects.
 * 
 * @typedef {Object} AudioChunk 
 * @prop {string} base64
 * @prop {number} index
 * @prop {string} contentType
 * @prop {string} text
 * 
 * @return {AudioChunksSession}
 */
function fetchAudio() {
  const apiKey = getApiKeyForUser();
  const input = getInputData();
  const tts_server = getCurrentService();

  // Basic validations on input
  if (!apiKey) throw new Error ("API key missing");  
  if (!input.text|| input.text === '(No text selected)') throw new Error ("No Text selected");
  if (!input.voice) throw new Error ("No Voice Selected");
  if (input.text.length > 5000) throw new Error ("Text too long");
  if (tts_server !== "google-tts" && tts_server !== "eleven_labs"){
    throw new Error ("Service Provider " + tts_server + "not found");
  }

  // Split text into chunks before sending to the server
  let textChunks = buildTextChunks(input.text);
  
  
  Logger.log("recieved input details from UI %s ", input);
  Logger.log("tts text to send %s", textChunks);
  let audioChunks = [];
  
  // Call TTS for each chunk and collect audio
  // Each packet will contain the text to be sent to TTS, along with any context
  // needed for the TTS call (e.g., previous and next chunks for Eleven Labs)
  for (let chunk of textChunks) {

    Logger.log("Sending chunk index:%s Text:%s", chunk.index, chunk.textValues.current );

    let audioObject = null;

    if (tts_server === "google-tts"){

      audioObject = g_callTextToSpeech(
        chunk.textValues.current,
        input.voice,
        input.locale,
        input.speed
      );
    } else if  (tts_server === "eleven_labs") {
      audioObject = el_callTextToSpeech(
        chunk.textValues,
        input.voice
      )
    }

    audioChunks.push({
      index: chunk.index,
      text: chunk.textValues.current,
      base64: audioObject.base64,
      contentType: audioObject.contentType,
    })
  } 



  Logger.log("Returned %s audio chunks, ", audioChunks.length);
  return {
    sessionId:  createSessionID(),
    provider: tts_server,
    voice: input.voice,
    gdoc_details: getDocFileName(),
    audioChunkCount: audioChunks.length,
    audioChunks: audioChunks
  }
}

function test_tts_connection() {
  let serve = getCurrentService();
  if (serve === "google-tts") {
    return g_testConnection();
  } else if (serve === "eleven_labs"){
    return el_testElevenLabsUser();
  } else {
    throw new Error("CURRENT_SERIVCE, " + serve + ", not found");
  }
}

function getAIVoiceList(isStudio=null) {
  let serve = getCurrentService();
  if (serve === "google-tts") {
    return {voices: g_getVoices(isStudio), "message": "Google Voices Loaded"};
  } else if (serve === "eleven_labs"){
    return {voices: el_getVoicesElevenLabs(), "message": "Eleven Labs Voices Loaded"};
  } else {
    throw new Error("CURRENT_SERIVCE, " + serve + ", not found");
  }
}