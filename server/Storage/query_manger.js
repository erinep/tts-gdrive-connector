function getFirestoreSession(sessionId) {
  const projectId = PropertiesService.getScriptProperties().getProperty("PROJECT_ID");
  const accessToken = getAccessTokenFromServiceAccount();
  
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/sessions/${sessionId}`;
  
  const options = {
    method: 'get',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    muteHttpExceptions: true, // Useful for catching 404s, etc.
  };
  
  const response = UrlFetchApp.fetch(url, options);
  const statusCode = response.getResponseCode();
  
  if (statusCode === 200) {
    const result = JSON.parse(response.getContentText());
    return result;
  } else if (statusCode === 404) {
    console.warn(`Session with ID ${sessionId} not found.`);
    console.warn(`message: ${response.getContentText()}`)
    return null;
  } else {
    console.error(`Error fetching session. Status: ${statusCode}`);
    console.error(response.getContentText());
    return null;
  }
}