function parseJSON(responseBody) {
  try {
    return JSON.parse(responseBody);
  } catch (error) {
    throw responseBody;
  }
}

module.exports = {
  parseJSON
}