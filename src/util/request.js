const https = require('https');
const FIREBASE_MESSAGING_TIMEOUT = 15000;

https.globalAgent.keepAlive = true;

function parseIfJSON(responseBody) {
  try {
    return JSON.parse(responseBody);
  } catch (error) {
    return responseBody;
  }
}

function sendRequest(url, method, accessToken, data) {
  return new Promise((resolve, reject) => {
    const jsonData = JSON.stringify(data);

    const options = {
      method: method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'access_token_auth': true,
        'Content-Type': 'application/json',
      },
      timeout: FIREBASE_MESSAGING_TIMEOUT, 
    };

    const req = https.request(url, options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      res.on('end', () => {
        const response = {
          status: res.statusCode,
          data: parseIfJSON(responseBody)
        };
        resolve(response);
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
    result.error = response;
  }
  return result;
}

async function sendRequestForSendResponse(url, method, accessToken, data) {
  const response = await sendRequest(url, method, accessToken, data);
  return buildSendResponse(response);
}

module.exports = {
  sendRequest,
  sendRequestForSendResponse
};
