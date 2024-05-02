const https = require('https');
const messagingErrorInternal = require('../app/messagin-error-internal');
const { parseJSON } = require('../util/helper');
const { HttpError } = require('../util/apiRequest');

const FIREBASE_MESSAGING_TIMEOUT = 15000;

https.globalAgent.keepAlive = true;

function sendRequest(host, path, method, accessToken, data) {
  return new Promise((resolve, reject) => {
    const jsonData = JSON.stringify(data);
    const options = {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'access_token_auth': true,
        'Content-Type': 'application/json',
      },
      timeout: FIREBASE_MESSAGING_TIMEOUT,
      method,
      host,
      path,
    }
    const req = https.request(options, (res) => {
      let responseBody = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      res.on('end', () => {
        try {
          const responseData = parseJSON(responseBody);
          const response = {
            status: res.statusCode,
            data: responseData
          };
          resolve(response);
        } catch (error) {
          reject(new HttpError(responseBody))
        }
      });
    });

    req.on('error', (error) => {
      reject(error.error);
    });

    req.write(jsonData);
    req.end();
  });
}


function buildSendResponse(response) {
  const result = {
    success: response.status === 200,
  };
  if (result.success) {
    result.messageId = response.data && response.data.name;
  } else {
    result.error = messagingErrorInternal.createFirebaseError(response.status, response.data && response.data.message, response);
  }
  return result;
}

async function sendRequestForSendResponse(host, path, method, accessToken, data) {
  try {
    const response = await sendRequest(host, path, method, accessToken, data);
    return buildSendResponse(response);
  } catch (error) {
    if (error instanceof HttpError) {
      throw {
        success: false,
        error: messagingErrorInternal.createFirebaseError(error.status, error.message, error)
      };
    }
    throw error;
  }
}

async function sendRequestWithErrorCheck(host, path, method, accessToken, data) {
  try {
    const response = await sendRequest(host, path, method, accessToken, data);
    const responseData = response.data;
    const errorCode = messagingErrorInternal.getErrorCode(responseData);
    if (errorCode) {
      const error = messagingErrorInternal.createFirebaseError(response.status, responseData.error.message,  responseData.error)
      throw (error);
    }
    return response;
  } catch (error) {
    if (error instanceof HttpError) {
      throw {
        success: false,
        error: messagingErrorInternal.createFirebaseError(error.status, error.message, error)
      };
    }
    throw error;
  }
}

module.exports = {
  sendRequestForSendResponse,
  sendRequestWithErrorCheck,
};
