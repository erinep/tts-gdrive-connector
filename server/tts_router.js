const CURRENT_SERVICE = "google"

function fetchAudioBase64(text, voice) {
  const apiKey = getApiKeyForUser();
  if (!apiKey) throw new Error ("API key missing");  
  if (!text|| text === '(No text selected)') throw new Error ("No Text selected");
  if (!voice) throw new Error ("No Voice Selected");
  if (text.length > 1000) throw new Error ("Text too long");

  if (CURRENT_SERVICE === "google") {
    return g_callTextToSpeech(text, voice, "en-US");
  } else if (CURRENT_SERVICE === "eleven_labs"){
    return el_callTextToSpeech(text, voice);
  } else {
    throw new Error("CURRENT_SERIVCE, " + CURRENT_SERVICE + ", not found");
  }
}

function test_tts_connection() {
  if (CURRENT_SERVICE === "google") {
    return g_testConnection();
  } else if (CURRENT_SERVICE === "eleven_labs"){
    return el_testElevenLabsUser();
  } else {
    throw new Error("CURRENT_SERIVCE, " + CURRENT_SERVICE + ", not found");
  }
}

function getAIVoiceList() {
  if (CURRENT_SERVICE === "google") {
    return g_getVoices();
  } else if (CURRENT_SERVICE === "eleven_labs"){
    return el_getVoicesElevenLabs();
  } else {
    throw new Error("CURRENT_SERIVCE, " + CURRENT_SERVICE + ", not found");
  }
}