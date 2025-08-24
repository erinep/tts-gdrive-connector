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

function fetchAudio(){
  const storage = "gsc"; // or "drive"
  const data = getInputData();

  return fetchAudioBase64(data);
  // audioStorageHandler(storage);
}


async function fetchAudioBase64({text, voice, locale, speed}) {
  const apiKey = getApiKeyForUser();
  if (!apiKey) throw new Error ("API key missing");  
  if (!text|| text === '(No text selected)') throw new Error ("No Text selected");
  if (!voice) throw new Error ("No Voice Selected");
  if (text.length > 5000) throw new Error ("Text too long");

  let serve = getCurrentService();
  if (serve === "google-tts") {
    const base64Audio  = g_callTextToSpeech(text, voice, locale, speed);
    return [{
      base64: base64Audio.base64,
      contentType: base64Audio.contentType,
      text: text,
      voice: voice,
      speed: speed,
      locale: locale,
      provider: serve,
      index: 0 // for Google, we're not chunking yet, so just set index to 0
    }]
  } else if (serve === "eleven_labs"){

    // Chunk the text before sending
    const chunks = chunkTextBySentence(text, 100);
    const audioChunks = [];

    //TODO: seperate chunking logic from tts call logic
    for (let i = 0; i < chunks.length; i++) {
      let textValues = {
        current: chunks[i],
        previous: i > 0 ? chunks[i - 1] : null,
        next: i < chunks.length - 1 ? chunks[i + 1] : null
      }
      const base64Audio = await el_callTextToSpeech(textValues, voice);
      audioChunks.push({
        base64: base64Audio.base64,
        contentType: base64Audio.contentType,
        voice: voice,
        text: textValues.current,
        provider: serve,
        index: i
      });
    }
    return audioChunks;
    
  } else {
    throw new Error("CURRENT_SERIVCE '" + serve + "' not found");
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