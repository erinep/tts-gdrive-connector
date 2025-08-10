const google_voices_all = {voices: ["Studio-Male","Studio-Female","Achernar","Achird","Algenib","Algieba","Alnilam","Aoede","Autonoe","Callirrhoe","Charon","Despina","Enceladus","Erinome","Fenrir","Gacrux","Iapetus","Kore","Laomedeia","Leda","Orus","Puck","Pulcherrima","Rasalgethi","Sadachbia","Sadaltager","Schedar","Sulafat","Umbriel","Vindemiatrix","Zephyr","Zubenelgenubi"]};
const google_chirp_voices = {"male":["Achird","Algenib","Algieba","Alnilam","Charon","Enceladus","Fenrir","Iapetus","Orus","Puck","Rasalgethi","Sadachbia","Sadaltager","Schedar","Umbriel","Zubenelgenubi"],"female":["Achernar","Aoede","Autonoe","Callirrhoe","Despina","Erinome","Gacrux","Kore","Laomedeia","Leda","Pulcherrima","Sulafat","Vindemiatrix","Zephyr"]}
const google_studio_voices = {
  "Studio-Female": {"en-US": "en-US-Studio-O", "en-GB": "en-GB-Studio-C"},
  "Studio-Male": {"en-US": "en-US-Studio-Q", "en-GB": "en-GB-Studio-B"}
}

function g_getVoices(includeStudio) {
  if (includeStudio) return {...google_chirp_voices, "studio": Object.keys(google_studio_voices)};
  else {
    Logger.log('sending chirp voices.')
    return google_chirp_voices;
  }
}

function g_testConnection() {
  throw new Error("not implemented");
}

function g_callTextToSpeech(text, voiceName, languageCode, speed) {
  const apiKey = getApiKeyForUser();
  const url = "https://texttospeech.googleapis.com/v1beta1/text:synthesize?key="+apiKey;

  let voice_id = ""

  if (voiceName.includes("studio")){
    if (languageCode=== "en-AU") throw new Error("Australian Studio Voice not supported");
    voice_id = google_studio_voices[voiceName][languageCode];
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
