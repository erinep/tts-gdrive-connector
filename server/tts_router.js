const CURRENT_SERVICE = "google"

function fetchAudioBase64(text, voice) {
  if (CURRENT_SERVICE === "google") {
    throw new Error("google fetchAudioBase64 not implemented")
  }

  if (CURRENT_SERVICE === "eleven_labs"){
    return el_fetchAudioBase64(text, voice);
  }
}

function test_tts_connection() {
  if (CURRENT_SERVICE === "google") {
    throw new Error("google test_tts_connection not implemented")
  }
  if (CURRENT_SERVICE === "eleven_labs"){
    return el_testElevenLabsUser();
  }
}

function getAIVoiceList() {
  if (CURRENT_SERVICE === "google") {
    throw new Error("google getAIVoiceList not implemented")
  }
  if (CURRENT_SERVICE === "eleven_labs"){
    return el_getVoicesElevenLabs();
  }
}