const EL_VOICES = {"male":[{"id":"G17SuINrv2H9FC6nvetn","name":"Christopher"},{"id":"NFG5qt843uXKj4pFvR7C","name":"Adam Stone - late night radio"},{"id":"NOpBlnGInO9m6vDvFkFC","name":"Grandpa Spuds Oxley"},{"id":"UGTtbzgh3HObxRjWaSpr","name":"Brian - Very Realistic Reader"},{"id":"XjLkpWUlnhS8i7gGz3lZ","name":"David Castlemore - Newsreader and Educator"},{"id":"YXpFCvM1S3JbWEJhoskW","name":"Wyatt- Wise Rustic Cowboy"},{"id":"uju3wxzG5OhpWcoi3SMy","name":"Michael C. Vincent"},{"id":"UgBBYS2sOqTuMpoF3BR0","name":"Mark - Natural Conversations"},{"id":"1SM7GgM6IMuvQlz2BwM3","name":"Mark - ConvoAI"},{"id":"IRHApOXLvnW57QJPQH2P","name":"Adam - Brooding, Dark, Tough American"},{"id":"wyWA56cQNU2KqUW4eCsI","name":"Clyde"},{"id":"6OzrBCQf8cjERkYgzSg8","name":"Young Jamal"},{"id":"6F5Zhi321D3Oq7v1oNT4","name":"Hank - A natural voice great for commercials, video games, and narration"}],"female":[{"id":"FVQMzxJGPUBtfz1Azdoy","name":"Danielle - Canadian Narrator"},{"id":"RILOU7YmBhvwJGDGjNmP","name":"Jane - Professional Audiobook Reader"},{"id":"ZF6FPAbjXT4488VcRRnw","name":"Amelia"},{"id":"aMSt68OGf4xUZAnLpTU8","name":"Juniper"},{"id":"wJqPPQ618aTW29mptyoc","name":"Ana-Rita"},{"id":"1hlpeD1ydbI2ow0Tt3EW","name":"Oracle X"},{"id":"h2sm0NbeIZXHBzJOMYcQ","name":"Natasha -  African American Woman"},{"id":"rfkTsdZrVWEVhDycUYn9","name":"Shelby"},{"id":"lcMyyd2HUfFzxdCaC4Ta","name":"Lucy - Fresh & Casual"}]};
const EL_MODELS = ["eleven_turbo_v2","eleven_flash_v2","eleven_v3"];

function el_getModels(){
  return EL_MODELS;
}

function el_callTextToSpeech(textValues, voice) {
  const apiKey = getApiKeyForUser();
  const payload = {
    "text": textValues.current,
    "previous_text": textValues.previous,
    "next_text": textValues.next,
    "previous_request_ids": null,
    "next_request_ids": null,
    "voice_settings": {
      "stability": null,
      "similarity_boost": null,
      "use_speaker_boost": false,
      "style": null,
      "speed": 1.0
    },
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