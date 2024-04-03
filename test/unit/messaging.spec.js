const { google } = require('googleapis');
const messaging = require('../../src/app/messaging');
const request = require('../../src/util/request');
const key = require('../../apikey.json')
const expect = require('chai').expect;

let accessToken = key.access_token;
const projectId = key.project_id;
const registrationToken = key.registration_token;
const client_email = key.client_email;
const private_key = key.private_key;
const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
const SCOPES = [MESSAGING_SCOPE];

function getAccessToken(client_email, private_key) {
  return new Promise(function(resolve, reject) {
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

describe('Messaging Functions', () => {
  beforeEach(async() => {
    accessToken = await getAccessToken(client_email, private_key);
  })
  describe('subscribeToTopic', () => {
    it('should send a request to subscribe to a topic', async () => {
      const topic = '/topics/fakeTopic';
      
      const response = await messaging.subscribeToTopic(accessToken, registrationToken, topic);
      
      expect(response).to.be.eql({
        status: 200,
        data: {
          results: [{}],
        },
      },
      );
    });
  });

  describe('send', () => {
    it('should send a message', async () => {
      const data = {
        "topic": "news",
        "notification": {
          "title": "Breaking News",
          "body": "New news story available."
        },
      }
      const dryRun = true;


      const response = await messaging.send(projectId, accessToken, data, dryRun);

      expect(response).to.have.property('success');
      expect(response.success).to.be.true;
    });

    it('should not send a message with incorrect access token', async () => {
      const accessToken = "incorrect_access_token";
      const data = {
        "topic": "news",
        "notification": {
          "title": "Breaking News",
          "body": "New news story available."
        },
      }
      const dryRun = true;


      const response = await messaging.send(projectId, accessToken, data, dryRun);
      console.log('response error', response.err)
      expect(response).to.have.property('success');
      expect(response.success).to.be.false;
      expect(response.success).to.be.false;
    });
  });

  describe('sendEachForMulticast', () => {
    it('sendEachForMulticast - should send a message to list of devices with tokens', async () => {
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
      const dryRun = true;


      const response = await messaging.sendEachForMulticast(projectId, accessToken, multicastMessage, dryRun);
      expect(response).to.have.property('successCount');
      expect(response).to.have.property('failureCount');
      expect(response).to.have.property('responses');
      expect(response.successCount).to.be.eq(1);
      expect(response.failureCount).to.be.eq(0);
      
    });

    it('sendEachForMulticast - should not send a message with incorrect access token', async () => {
      const accessToken = "incorrect_access_token";
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
      const dryRun = true;

      const response = await messaging.sendEachForMulticast(projectId, accessToken, multicastMessage, dryRun);
      console.log('response error', response.err)
      expect(response).to.have.property('successCount');
      expect(response).to.have.property('failureCount');
      expect(response).to.have.property('responses');
      expect(response.successCount).to.be.eq(0);
      expect(response.failureCount).to.be.eq(1);
    });
  });

  describe('unsubscribeFromTopic', () => {
    it('should send a request to unsubscribeResponse to a topic', async () => {
      const topic = '/topics/fakeTopic';
      
      await messaging.subscribeToTopic(accessToken, registrationToken, topic);
      const unsubscribeResponse = await messaging.unsubscribeFromTopic(accessToken, registrationToken, topic);
      
      expect(unsubscribeResponse).to.be.eql({
        status: 200,
        data: {
          results: [{}],
        },
      },
      );
    });
  });
});
