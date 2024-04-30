const messaging = require('./')
const { google } = require('googleapis');
const key = require('./apikey.json')

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
const SCOPES = [MESSAGING_SCOPE];

const registrationToken = key.registration_token;
const client_email = key.client_email;
const private_key = key.private_key;

const projectId = key.project_id;

const topicName = '/topics/FCM_2787_10_1';

const data = {
  "topic": "news",
  "notification": {
    "title": "Breaking News",
    "body": "New news story available."
  },
}

const multicastMessage = {
  ...data,
  tokens: [registrationToken],
};

function getAccessToken(client_email, private_key) {
  return new Promise(function(resolve, reject) {
    // const key = require('../placeholders/service-account.json');
    const jwtClient = new google.auth.JWT(
      client_email,
      null,
      private_key,
      SCOPES,
      null
    );
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
    });
  });
};


async function getToken() {
  const accessToken = await getAccessToken(client_email, private_key);
  console.log('getAccessToken token:', accessToken);
}

getToken();

async function sendNotification() {
  try {
    const accessToken = await getAccessToken(client_email, private_key);
    console.log('getAccessToken token:', accessToken);

    const subscribeResponse = await messaging.subscribeToTopic(accessToken, registrationToken, topicName);
    console.log('Subscribed to topic successfully 1:', subscribeResponse);

    const sendResponse = await messaging.send(projectId, accessToken, data, true);
    console.log('FCM message sent successfully:', sendResponse);
  } catch (error) {
    console.error('Error:', error);
  }
}

// sendNotification();



async function UnsubscribeExample() {
  try {
    const accessToken = await getAccessToken(client_email, private_key);
    // console.log('getAccessToken token:', accessToken);

    const subscribeResponse = await messaging.subscribeToTopic(accessToken, iidToken, topicName);
    console.log('Subscribed to topic successfully 1:', subscribeResponse);

    const unsubscribeResponse = await messaging.unsubscribeFromTopic(accessToken, iidToken, topicName);
    console.log('Unsubscribed from topic successfully:', unsubscribeResponse);
  } catch (error) {
    console.error('Error:', error);
  }
}

// UnsubscribeExample();




// Multicast
async function multiCastExample() {
  try {
    const accessToken = await getAccessToken(client_email, private_key);
    // console.log('getAccessToken token:', accessToken);

    const subscribeResponse = await messaging.subscribeToTopic(accessToken, registrationToken, topicName);
    console.log('Subscribed to topic successfully 3:', subscribeResponse);

    const multicastResponse = await messaging.sendEachForMulticast(projectId, accessToken, multicastMessage, true);
    console.log('FCM multicast message sent successfully:', multicastResponse);
  } catch (error) {
    console.error('Error:', error);
  }
}

multiCastExample();

module.exports = {
  subscribeToTopic: messaging.subscribeToTopic,
  send: messaging.send,
  sendEachForMulticast: messaging.sendEachForMulticast,
  unsubscribeFromTopic: messaging.unsubscribeFromTopic,
  sendEach: messaging.sendEach,
}