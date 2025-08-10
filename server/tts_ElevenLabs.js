const EL_VOICES = {all: [{"name":"William Shanks","id":"8Es4wFxsDlHBmFWAOWRS"},{"name":"Christopher","id":"G17SuINrv2H9FC6nvetn"},{"name":"Benjamin - Deep, Warm, Calming","id":"LruHrtVF6PSyGItzMNHS"},{"name":"John Morgan - Old West Southern Cowboy","id":"ruirxsoakN0GWmGNIo04"},{"name":"Hey Its Brad - Eyewitness Interview","id":"MYiFAKeVwcvm4z9VsFAR"},{"name":"Creature - Goblin Mythical Monster","id":"Z7RrOqZFTyLpIlzCgfsp"},{"name":"Johnny Dynamite - 80s Radio DJ","id":"CeNX9CMwmxDxUF5Q2Inm"},{"name":"Jessica Anne Bogart - Character and Animation","id":"flHkNRp1BlvT73UL6gyz"},{"name":"Northern Terry","id":"wo6udizrrtpIxWGp2qJk"},{"name":"Juniper","id":"aMSt68OGf4xUZAnLpTU8"},{"name":"Julian - deep rich mature British voice","id":"7p1Ofvcwsv7UBPoFNcpI"},{"name":"Wyatt- Wise Rustic Cowboy","id":"YXpFCvM1S3JbWEJhoskW"},{"name":"David Castlemore - Newsreader and Educator","id":"XjLkpWUlnhS8i7gGz3lZ"},{"name":"Michael C. Vincent","id":"uju3wxzG5OhpWcoi3SMy"},{"name":"John Doe - Deep","id":"EiNlNiXeDU1pqqOPrYMO"},{"name":"Adam Stone - late night radio","id":"NFG5qt843uXKj4pFvR7C"},{"name":"Danielle - Canadian Narrator","id":"FVQMzxJGPUBtfz1Azdoy"},{"name":"Ana-Rita","id":"wJqPPQ618aTW29mptyoc"},{"name":"Jane - Professional Audiobook Reader","id":"RILOU7YmBhvwJGDGjNmP"},{"name":"Monika Sogam - Suspense and Horror Storyteller","id":"6qL48o1LBmtR94hIYAQh"},{"name":"Hope - soothing narrator","id":"iCrDUkL56s3C8sCRl7wb"},{"name":"Ivy - Free Spirit","id":"i4CzbCVWoqvD0P1QJCUL"},{"name":"Amelia","id":"ZF6FPAbjXT4488VcRRnw"},{"name":"Grandfather Joe -  Gentle, warm & wise","id":"0lp4RIz96WD1RUtvEu3Q"},{"name":"Grandpa Spuds Oxley","id":"NOpBlnGInO9m6vDvFkFC"},{"name":"Brian - Very Realistic Reader","id":"UGTtbzgh3HObxRjWaSpr"}]};
const EL_MODELS = ["eleven_turbo_v2","eleven_flash_v2","eleven_v3"];

function el_getModels(){
  return EL_MODELS;
}

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
  return EL_VOICES;
}