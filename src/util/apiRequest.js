
class HttpError extends Error {
  constructor(response) {
    super(`Server responded with status ${response.status}.`);
    // Set the prototype so that instanceof checks will work correctly.
    // See: https://github.com/Microsoft/TypeScript/issues/13965
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

module.exports = {
  HttpError,
}