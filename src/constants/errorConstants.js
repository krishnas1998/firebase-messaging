const MessagingClientErrorCode = {
  INVALID_ARGUMENT: {
    code: 'invalid-argument',
    message: 'Invalid argument provided.',
  },
  AUTHENTICATION_ERROR: {
    code: 'authentication-error',
    message: 'An error occurred when trying to authenticate to the FCM servers. Make sure the ' +
      'credential used to authenticate this SDK has the proper permissions. See ' +
      'https://firebase.google.com/docs/admin/setup for setup instructions.',
  },
  INTERNAL_ERROR: {
    code: 'internal-error',
    message: 'An internal error has occurred. Please retry the request.',
  },
  SERVER_UNAVAILABLE: {
    code: 'server-unavailable',
    message: 'The FCM server could not process the request in time. See the error documentation ' +
      'for more details.',
  },
  UNKNOWN_ERROR: {
    code: 'unknown-error',
    message: 'An unknown server error was returned.',
  },
};

module.exports = {
  MessagingClientErrorCode,
};
