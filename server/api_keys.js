// const SERVICE_NAME = "eleven_labs";
const SERVICE_NAME = "google-tts";

function setApiKeyForUser(key) {
  if (typeof key !== 'string') throw new Error('API key must be a string.');
  key = key.trim();
  if (!key) throw new Error('Empty key, not saved.');

  PropertiesService.getUserProperties().setProperty(SERVICE_NAME, key);
  return 'API key saved.';
}

function getApiKeyForUser() {
  return PropertiesService.getUserProperties().getProperty(SERVICE_NAME);
}

function _clearApiKeyForUser() {
  PropertiesService.getUserProperties().deleteProperty(SERVICE_NAME);
}


