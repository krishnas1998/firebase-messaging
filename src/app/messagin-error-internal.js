const validator = require('../util/validator')
const errorConstants = require('../constants/errorConstants')
/**
 * @param response - The response to check for errors.
 * @returns The error code if present; null otherwise.
 */
function getErrorCode(response) {
  if (validator.isNonNullObject(response) && 'error' in response) {
    const error = response.error;
    if (validator.isString(error)) {
      return error;
    }
    if (validator.isArray(error.details)) {
      const fcmErrorType = 'type.googleapis.com/google.firebase.fcm.v1.FcmError';
      for (const element of error.details) {
        if (element['@type'] === fcmErrorType) {
          return element.errorCode;
        }
      }
    }
    if ('status' in error) {
      return error.status;
    } else {
      return error.message;
    }
  }

  return null;
}

function createFirebaseError(status, message, errorData) {
  let error;
  switch (status) {
  case 400:
    error = errorConstants.MessagingClientErrorCode.INVALID_ARGUMENT;
    break;
  case 401:
  case 403:
    error = errorConstants.MessagingClientErrorCode.AUTHENTICATION_ERROR;
    break;
  case 500:
    error = errorConstants.MessagingClientErrorCode.INTERNAL_ERROR;
    break;
  case 503:
    error = errorConstants.MessagingClientErrorCode.SERVER_UNAVAILABLE;
    break;
  default:
    // Treat non-JSON responses with unexpected status codes as unknown errors.
    error = errorConstants.MessagingClientErrorCode.UNKNOWN_ERROR;
  }
  return {
    code: error.code,
    message: `${ error.message } Raw server response: "${ message }". Status code: ` +
      `${ status }.`,
    errorData
  };
}

module.exports = {
  getErrorCode,
  createFirebaseError
}
