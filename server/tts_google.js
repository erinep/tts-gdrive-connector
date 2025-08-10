const google_voices = {voices: ["Studio-Male","Studio-Female","Achernar","Achird","Algenib","Algieba","Alnilam","Aoede","Autonoe","Callirrhoe","Charon","Despina","Enceladus","Erinome","Fenrir","Gacrux","Iapetus","Kore","Laomedeia","Leda","Orus","Puck","Pulcherrima","Rasalgethi","Sadachbia","Sadaltager","Schedar","Sulafat","Umbriel","Vindemiatrix","Zephyr","Zubenelgenubi"]};
const studioVoiceLookup = {
  "Studio-Female": {"en-US": "en-US-Studio-O", "en-GB": "en-GB-Studio-C"},
  "Studio-Male": {"en-US": "en-US-Studio-Q", "en-GB": "en-GB-Studio-B"}
}

function g_getVoices() {
  return google_voices;
}

function g_testConnection() {
  throw new Error("not implemented");
}

function g_callTextToSpeech(text, voiceName, languageCode, speed) {
  const apiKey = getApiKeyForUser();
  const url = "https://texttospeech.googleapis.com/v1beta1/text:synthesize?key="+apiKey;

  let voice_id = ""

  if(voiceName.includes("Studio")){
    if (languageCode=== "en-AU") throw new Error("Australian Studio Voice not supported");
    voice_id = studioVoiceLookup[voiceName][languageCode];
  } else {
    voice_id = languageCode + "-Chirp3-HD-" + voiceName;
  }

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      "audioConfig": {
      "audioEncoding": "LINEAR16",
      "speakingRate": speed
      },
      "input": {
        "text": text
      },
      "voice": {
        "languageCode": languageCode,
        "name": voice_id
      }
    })
  };
  const res = UrlFetchApp.fetch(url, options);
  if (res.getResponseCode() !== 200){
    const content = res.getContentText();
    Logger.log('failed g_callTextToSpeech...');
    Logger.log(content);
    throw new Error ("HTTP ERROR: " + content );
  }

  try{
    return {
      "base64": JSON.parse(res).audioContent,
      "contentType": "audio/wav"
    }
  } catch(e) {
    Logger.log(res)
    throw new Error(e.message)
  }
}
