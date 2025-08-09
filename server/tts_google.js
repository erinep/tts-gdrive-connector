const google_voices = ["Achernar","Achird","Algenib","Algieba","Alnilam","Aoede","Autonoe","Callirrhoe","Charon","Despina","Enceladus","Erinome","Fenrir","Gacrux","Iapetus","Kore","Laomedeia","Leda","Orus","Puck","Pulcherrima","Rasalgethi","Sadachbia","Sadaltager","Schedar","Sulafat","Umbriel","Vindemiatrix","Zephyr","Zubenelgenubi"]

function g_getVoices() {
  return google_voices;
}

function g_testConnection() {
  throw new Error("not implemented");
}

function g_callTextToSpeech(text, voiceName, languageCode) {
  const apiKey = getApiKeyForUser();
  const url = "https://texttospeech.googleapis.com/v1beta1/text:synthesize?key="+apiKey;

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      "audioConfig": {
      "audioEncoding": "LINEAR16",
      "effectsProfileId": [
        "headphone-class-device"
      ],
      },
      "input": {
        "text": text
      },
      "voice": {
        "languageCode": languageCode,
        "name": languageCode + "-Chirp3-HD-" + voiceName,
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
  const blob = res.getBlob();
  return toBase64Obj(blob);
}
