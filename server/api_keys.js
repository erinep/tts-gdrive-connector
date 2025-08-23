// const SERVICE_NAME = "eleven_labs";
// const SERVICE_NAME = "google-tts";

function setApiKeyForUser(key) {
  if (typeof key !== 'string') throw new Error('API key must be a string.');
  key = key.trim();
  if (!key) throw new Error('Empty key, not saved.');

  const service = getCurrentService();
  PropertiesService.getUserProperties().setProperty(service, key);
  return 'API key saved.';
}

function getApiKeyForUser() {
  const service = getCurrentService();
  return PropertiesService.getUserProperties().getProperty(service);
}

function _clearApiKeyForUser() {
  const service = getCurrentService();
  PropertiesService.getUserProperties().deleteProperty(service);
}


function getServiceAccountKey() {
  const keyStr = PropertiesService.getScriptProperties().getProperty('SERVICE_ACCOUNT_KEY');
  return JSON.parse(keyStr);
}

function getAccessTokenFromServiceAccount() {
  const key = getServiceAccountKey();
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 3600;

  const header = {
    alg: "RS256",
    typ: "JWT"
  };

  const payload = {
    iss: key.client_email,
    scope: "https://www.googleapis.com/auth/devstorage.read_write",
    aud: "https://oauth2.googleapis.com/token",
    iat: iat,
    exp: exp
  };

  const encode = obj => Utilities.base64EncodeWebSafe(JSON.stringify(obj)).replace(/=+$/, '');
  const encodedHeader = encode(header);
  const encodedPayload = encode(payload);
  const toSign = `${encodedHeader}.${encodedPayload}`;

  const signatureBytes = Utilities.computeRsaSha256Signature(toSign, key.private_key);
  const encodedSignature = Utilities.base64EncodeWebSafe(signatureBytes).replace(/=+$/, '');

  const jwt = `${toSign}.${encodedSignature}`;

  const tokenResponse = UrlFetchApp.fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    payload: {
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    },
    muteHttpExceptions: true
  });

  const result = JSON.parse(tokenResponse.getContentText());
  if (!result.access_token) {
    throw new Error('Failed to get access token: ' + tokenResponse.getContentText());
  }

  return result.access_token;
}
