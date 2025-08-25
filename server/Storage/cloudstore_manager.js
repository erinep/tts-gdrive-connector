const BUCKET_NAME = "tts-bucket-v1"

/**
 * 
 * @param {string} base64String 
 * @param {string} fileName 
 * @returns {{bucketName: string, objectName: string}}
 * 
 */
function uploadBase64ToGCS(base64String, fileName) {
  // Function to get OAuth token using service account credentials
  const token = getAccessTokenFromServiceAccount();

  if (!fileName) fileName = Utilities.getUuid() + '.mp3';

  // Decode base64 string to bytes
  const bytes = Utilities.base64Decode(base64String);

  // Prepare the upload URL for your bucket
  const url = `https://storage.googleapis.com/upload/storage/v1/b/${BUCKET_NAME}/o?uploadType=media&name=${encodeURIComponent(fileName)}`;

  // Make the POST request with OAuth token and binary data
  const options = {
    method: 'POST',
    contentType: 'audio/mpeg',
    payload: bytes,
    headers: {
      Authorization: 'Bearer ' + token,
    },
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const code = response.getResponseCode();
  const content = response.getContentText();

  if (code === 200) {
    const json = JSON.parse(content);
    Logger.log('File uploaded successfully: %s', json.mediaLink);
    return {
      bucketName: json.bucket,
      objectName: json.name,
    }
  } else {
    Logger.log('Failed to upload file: %s', content);
    throw new Error('Upload failed with code ' + code);
  }
}

/**
 * 
 * @param {string} objectName 
 * @returns {blob}
 */
function downloadFileFromGCS(objectName) {
  const token = getAccessTokenFromServiceAccount();

  const url = `https://storage.googleapis.com/storage/v1/b/${BUCKET_NAME}/o/${encodeURIComponent(objectName)}?alt=media`;

  const response = UrlFetchApp.fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    },
    muteHttpExceptions: true
  });

  if (response.getResponseCode() !== 200) {
    throw new Error("Failed to fetch file: " + response.getContentText());
  }

  const blob = response.getBlob();
  return blob;
}

/**
 * 
 * @param {string} objectName 
 * @param {number} expirationInSeconds 
 * @returns {string}
 */
function getSignedUrl(objectName, expirationInSeconds) {
  const serviceAccount = getServiceAccountKey();
  const clientEmail = serviceAccount.client_email;
  const privateKey = serviceAccount.private_key;

  const expiration = Math.floor(Date.now() / 1000) + expirationInSeconds;
  const verb = 'GET';
  const contentMd5 = '';
  const contentType = '';
  const canonicalizedResource = `/` + BUCKET_NAME + `/` + objectName;

  const stringToSign = [
    verb,
    contentMd5,
    contentType,
    expiration,
    canonicalizedResource
  ].join('\n');

  // sign the string with private key
  const signatureBytes = Utilities.computeRsaSha256Signature(stringToSign, privateKey);
  const signature = encodeURIComponent(Utilities.base64Encode(signatureBytes));

  const signedUrl = `https://storage.googleapis.com${canonicalizedResource}` +
    `?GoogleAccessId=${clientEmail}&Expires=${expiration}&Signature=${signature}`;

  return signedUrl;
}
