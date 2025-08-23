function getOAuthService() {
  const scriptProps = PropertiesService.getScriptProperties();

  return OAuth2.createService('GoogleCloudStorage')
    .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
    .setTokenUrl('https://oauth2.googleapis.com/token')
    .setClientId(scriptProps.getProperty('GCS_CLIENT_ID'))
    .setClientSecret(scriptProps.getProperty('GCS_CLIENT_SECRET')) 
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getUserProperties())
    .setScope('https://www.googleapis.com/auth/devstorage.read_write')
    .setParam('access_type', 'offline')
    .setParam('prompt', 'consent');
}

// OAuth2 callback function for handling Google's response
function authCallback(request) {
  const service = getOAuthService();
  const authorized = service.handleCallback(request);
  if (authorized) {
    return HtmlService.createHtmlOutput('Authorization successful! You can close this tab.');
  } else {
    return HtmlService.createHtmlOutput('Authorization denied. You can close this tab.');
  }
}