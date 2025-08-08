function fetchAudioBase64(text, voice) {
  return el_fetchAudioBase64(text, voice);
}

function test_tts_connection() {
  return el_testElevenLabsUser();
}

function getAIVoiceList() {
  return el_getVoicesElevenLabs();
}