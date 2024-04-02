const request = require('../util/request');
const validator = require('../util/validator')

const FCM_SEND_HOST = 'fcm.googleapis.com';
const FCM_SEND_PATH = '/fcm/send';
const FCM_TOPIC_MANAGEMENT_HOST = 'iid.googleapis.com';
const FCM_TOPIC_MANAGEMENT_ADD_PATH = '/iid/v1:batchAdd';
const FCM_TOPIC_MANAGEMENT_REMOVE_PATH = '/iid/v1:batchRemove';
const iidUrl = `https://${FCM_TOPIC_MANAGEMENT_HOST}/iid/v1`;
const fcmUrl = `https://${FCM_SEND_HOST}${FCM_SEND_PATH}`;
const MESSAGING_HTTP_METHOD = 'POST';

// function sendToDevice(token, data, callback) {
//   request.sendRequest(fcmUrl, MESSAGING_HTTP_METHOD, token, data, callback);
// }

function getUrlPath(projectId) {
  return `/v1/projects/${projectId}/messages:send`
}

function send(projectId, accessToken, message, dryRun) {
  const urlPath = getUrlPath(projectId);
  const url = `https://${FCM_SEND_HOST}${urlPath}`;
  const data = { message };
  if (dryRun) {
    data.validate_only = true;
  }
  return request.sendRequestForSendResponse(url, MESSAGING_HTTP_METHOD, accessToken, data);
}

function sendEach(projectId, accessToken, messages, dryRun) {
  const urlPath = getUrlPath(projectId);
  const url = `https://${FCM_SEND_HOST}${urlPath}`;
  const requests = messages.map((message) => {
    const data = { message };
    if (dryRun) {
      data.validate_only = true;
    }
    return request.sendRequestForSendResponse(url, MESSAGING_HTTP_METHOD, accessToken, data);
  });
  
  return Promise.allSettled(requests)
    .then((results) => {
      const responses = [];
      results.forEach(result => {
        
        if (result.status === 'fulfilled') {
          responses.push(result.value);
        } else { // rejected
          responses.push({ success: false, error: result.reason });
        }
      });
      const successCount = responses.filter((resp) => resp.success).length;
      return {
        responses,
        successCount,
        failureCount: responses.length - successCount,
      };
    });
}


function sendEachForMulticast(projectId, accessToken, message, dryRun) {
  const messages = message.tokens.map((token) => {
    return {
      token,
      android: message.android,
      apns: message.apns,
      data: message.data,
      notification: message.notification,
      webpush: message.webpush,
      fcmOptions: message.fcmOptions,
    };
  });
  return sendEach(projectId, accessToken, messages, dryRun);
}

// function sendToTopic(topic, accessToken, message, dryRun) {
//   const data = { ...message };
//   data.to = topic
//   if (dryRun) {
//     request.validate_only = true;
//   }
//   return request.sendRequest(fcmUrl, MESSAGING_HTTP_METHOD, accessToken, data);
// }

  /**
   * Helper method which sends and handles topic subscription management requests.
   *
   * @param registrationTokenOrTokens - The registration token or an array of
   *     registration tokens to unsubscribe from the topic.
   * @param topic - The topic to which to subscribe.
   * @param path - The endpoint path to use for the request.
   *
   * @returns A Promise fulfilled with the parsed server
   *   response.
   */
function sendTopicManagementRequest(accessToken, registrationTokenOrTokens, topic, path) {
  let registrationTokensArray = registrationTokenOrTokens;
  if(validator.isString(registrationTokenOrTokens)) {
    registrationTokensArray = [registrationTokenOrTokens];
  }
  const data = {
    to: topic,
    registration_tokens: registrationTokensArray,
  };
  const url = `https://${FCM_TOPIC_MANAGEMENT_HOST}${path}`;
  return request.sendRequest(url, MESSAGING_HTTP_METHOD, accessToken, data);
}

function subscribeToTopic(accessToken, registrationTokenOrTokens, topic) {
  const path = FCM_TOPIC_MANAGEMENT_ADD_PATH;
  return sendTopicManagementRequest(accessToken, registrationTokenOrTokens, topic, path);
}

function unsubscribeFromTopic(accessToken, registrationTokenOrTokens, topic) {
  const path = FCM_TOPIC_MANAGEMENT_REMOVE_PATH;
  return sendTopicManagementRequest(accessToken, registrationTokenOrTokens, topic, path);

}

module.exports = {
  // sendToDevice,
  subscribeToTopic,
  unsubscribeFromTopic,
  send,
  sendEachForMulticast,
  sendEach,
}