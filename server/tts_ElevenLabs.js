
function el_callTextToSpeech(text, voice) {
  const apiKey = getApiKeyForUser();
  const payload = {
    "text": text,
    "model_id": "eleven_turbo_v2",
  };
  const res = UrlFetchApp.fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
    method: 'post',
    contentType: 'application/json',
    headers: { 'xi-api-key': apiKey },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
  if (res.getResponseCode() !== 200){
    const content = res.getContentText()
    Logger.log('failed el_callTextToSpeech...');
    Logger.log(content)
    throw new Error ("HTTP ERROR: " + content );
  }
  const blob = res.getBlob();
  return toBase64Obj(blob);
}


function el_testElevenLabsUser() {
  const apiKey = getApiKeyForUser();
  if (!apiKey) throw new Error("API key missing.");
  const res = UrlFetchApp.fetch("https://api.elevenlabs.io/v1/user", {
    method: "get",
    headers: {"xi-api-key": apiKey},
  });
  if (res.getResponseCode() !== 200) { throw new Error ("HTTP ERROR: " + res.getContentText()); }
  const content = res.getContentText();
  const json =  JSON.parse(content);
  const precentage = Math.ceil(json.subscription.character_count / json.subscription.character_limit * 100)
  const summary = `Credits used this month: ${json.subscription.character_count} of ${json.subscription.character_limit} (${precentage}%)`;    
  return summary;
}

function el_getVoicesElevenLabs() {
  const apiKey = getApiKeyForUser();
  if (!apiKey) throw new Error("API key missing.");
  const res = UrlFetchApp.fetch("https://api.elevenlabs.io/v2/voices", {
    method: "get",
    headers: {"xi-api-key": apiKey},
  });
  if (res.getResponseCode() !== 200) { throw new Error("HTTP ERROR: " + res.getContentText()); }
  const content = res.getContentText();
  // Logger.log(content)
  return JSON.parse(content);
}