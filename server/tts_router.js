const CURRENT_SERVICE = "eleven_labs"

function fetchAudioBase64(text, voice) {

  if (CURRENT_SERVICE === "eleven_labs"){
      return el_fetchAudioBase64(text, voice);
  }
}

function test_tts_connection() {
    if (CURRENT_SERVICE === "eleven_labs"){
        return el_testElevenLabsUser();
    }
}

function getAIVoiceList() {
    if (CURRENT_SERVICE === "eleven_labs"){
        return el_getVoicesElevenLabs();
    }
}