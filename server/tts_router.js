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

function fetchAudioBase64(text, voice, locale, speed) {
  const apiKey = getApiKeyForUser();
  if (!apiKey) throw new Error ("API key missing");  
  if (!text|| text === '(No text selected)') throw new Error ("No Text selected");
  if (!voice) throw new Error ("No Voice Selected");
  if (text.length > 1000) throw new Error ("Text too long");

  let serve = getCurrentService();
  if (serve === "google-tts") {
    return g_callTextToSpeech(text, voice, locale, speed);
  } else if (serve === "eleven_labs"){
    return el_callTextToSpeech(text, voice);
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