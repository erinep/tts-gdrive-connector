
function uploadBase64ToGCS(base64String, fileName) {
  const service = getOAuthService();
  if (!service.hasAccess()) {
    throw new Error('Authorization required. Run authorize() first.');
  }

  // Decode base64 string to bytes
  const bytes = Utilities.base64Decode(base64String);

  // Prepare the upload URL for your bucket
  const bucketName = 'tts-bucket-v0';
  const url = `https://storage.googleapis.com/upload/storage/v1/b/${bucketName}/o?uploadType=media&name=${encodeURIComponent(fileName)}`;

  // Make the POST request with OAuth token and binary data
  const options = {
    method: 'POST',
    contentType: 'application/octet-stream',
    payload: bytes,
    headers: {
      Authorization: 'Bearer ' + service.getAccessToken(),
    },
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const code = response.getResponseCode();
  const content = response.getContentText();

  if (code === 200) {
    const json = JSON.parse(content);
    Logger.log('File uploaded successfully: %s', json.mediaLink);
    return json;  // Contains metadata including mediaLink, name, bucket, etc.
  } else {
    Logger.log('Failed to upload file: %s', content);
    throw new Error('Upload failed with code ' + code);
  }
}
