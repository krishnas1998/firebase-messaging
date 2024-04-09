const messaging = require('./src/app/messaging')

module.exports = {
  subscribeToTopic: messaging.subscribeToTopic,
  send: messaging.send,
  sendEachForMulticast: messaging.sendEachForMulticast,
  unsubscribeFromTopic: messaging.unsubscribeFromTopic,
  sendEach: messaging.sendEach,
}