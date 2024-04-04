# Firebase Cloud Messaging (FCM) API Usage

This module provides functions to interact with the Firebase Cloud Messaging (FCM) API for sending messages, subscribing/unsubscribing devices to/from topics, and handling multicast messages.

## Functions

### `subscribeToTopic(accessToken, registrationTokenOrTokens, topic)`

Subscribes a device or multiple devices to an FCM topic.

- **accessToken** (string): Access token generated by Google JWT.
- **registrationTokenOrTokens** (string|string[]): A token or array of registration tokens for the devices to subscribe to the topic.
- **topic** (string): The topic to which to subscribe.

Returns a promise fulfilled with the server's response after the device(s) have been subscribed to the topic.

### `unsubscribeFromTopic(accessToken, registrationTokenOrTokens, topic)`

Unsubscribes a device or multiple devices from an FCM topic.

- **accessToken** (string): Access token generated by Google JWT.
- **registrationTokenOrTokens** (string|string[]): A device registration token or an array of device registration tokens to unsubscribe from the topic.
- **topic** (string): The topic from which to unsubscribe.

Returns a promise fulfilled with the server's response after the device(s) have been unsubscribed from the topic.

### `send(projectId, accessToken, message, dryRun)`

Sends a message via FCM.

- **projectId** (string): Project ID assigned in Firebase.
- **accessToken** (string): Access token generated by Google JWT.
- **message** ([Message](#message)): The message payload.
- **dryRun** (boolean): Whether to send the message in the dry-run (validation only) mode.

Returns a promise fulfilled with a unique message ID string after the message has been successfully handed off to the FCM service for delivery.

### `sendEachForMulticast(projectId, accessToken, message, dryRun)`

Sends a multicast message to all specified device tokens.

- **projectId** (string): Project ID assigned in Firebase.
- **accessToken** (string): Access token generated by Google JWT.
- **message** ([MulticastMessage](#multicastmessage)): A multicast message containing an array of device tokens.
- **dryRun** (boolean): Whether to send the message in the dry-run (validation only) mode.

Returns a promise fulfilled with an object representing the result of the send operation.

### `sendEach(projectId, accessToken, messages, dryRun)`

Sends each message in the given array via Firebase Cloud Messaging.

- **projectId** (string): Project ID assigned in Firebase.
- **accessToken** (string): Access token generated by Google JWT.
- **messages** ([Message](#message)[]): A non-empty array containing up to 500 messages.
- **dryRun** (boolean): Whether to send the messages in the dry-run (validation only) mode.

Returns a promise fulfilled with an object representing the result of the send operation.

## Message Structures

### `Message`

Payload for sending messages via FCM.

```javascript
{
  data?: { [key: string]: string };
  notification?: Notification;
  android?: AndroidConfig;
  webpush?: WebpushConfig;
  apns?: ApnsConfig;
  fcmOptions?: FcmOptions;
}
```

For more details, refer to the [Firebase Admin Node SDK Messaging API documentation](https://github.com/firebase/firebase-admin-node/blob/837b69b61b3df3dcd8a31ccd16062e1bba236dca/src/messaging/messaging-api.ts).


# Test case coverage status

```test coverage status
---------------|---------|----------|---------|---------|-------------------
File           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
---------------|---------|----------|---------|---------|-------------------
All files      |   94.44 |       70 |    90.9 |   94.36 |                   
 app           |   95.23 |       50 |   91.66 |   95.12 |                   
  messaging.js |   95.23 |       50 |   91.66 |   95.12 | 76-78             
 util          |   93.33 |      100 |      90 |   93.33 |                   
  request.js   |   92.85 |      100 |   88.88 |   92.85 | 10,43             
  validator.js |     100 |      100 |     100 |     100 |                   
---------------|---------|----------|---------|---------|-------------------

```