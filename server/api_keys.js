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


