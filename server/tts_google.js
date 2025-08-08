
function fetchAudioBase64(text, voice) {
  const apiKey = getApiKeyForUser();
  if (!apiKey) throw new Error ("API key missing");  
  if (!text|| text === '(No text selected)') throw new Error ("No Text selected");
  if (!voice) throw new Error ("No Voice Selected");
  if (text.length > 1000) throw new Error ("Text too long");
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
    Logger.log('error in tts server call...');
    Logger.log(content)
    throw new Error ("HTTP ERROR: " + content );
  }
  const blob = res.getBlob();
  return toBase64(blob);
}


function testElevenLabsUser() {
  const apiKey = getApiKeyForUser();
  if (!apiKey) throw new Error("API key missing.");
  const res = UrlFetchApp.fetch("https://api.elevenlabs.io/v1/user", {
    method: "GET",
    headers: {"xi-api-key": apiKey},
  });
  if (res.getResponseCode() !== 200) { throw new Error ("HTTP ERROR: " + res.getContentText()); }
  const content = res.getContentText();
  const json =  JSON.parse(content);
  const precentage = Math.ceil(json.subscription.character_count / json.subscription.character_limit * 100)
  const summary = `Credits used this month: ${json.subscription.character_count} of ${json.subscription.character_limit} (${precentage}%)`;    
  return summary;
}

function getVoicesElevenLabs() {
  const apiKey = getApiKeyForUser();
  if (!apiKey) throw new Error("API key missing.");
  const res = UrlFetchApp.fetch("https://api.elevenlabs.io/v2/voices", {
    method: "GET",
    headers: {"xi-api-key": apiKey},
  });
  if (res.getResponseCode() !== 200) { throw new Error("HTTP ERROR: " + res.getContentText()); }
  const content = res.getContentText();
  // Logger.log(content)
  return JSON.parse(content);
}