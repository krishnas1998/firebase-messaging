function isString(value) {
  return typeof value === 'string';
}

/**
 * Validates that a value is an array.
 *
 * @param value - The value to validate.
 * @returns Whether the value is an array or not.
 */
function isArray(value) {
  return Array.isArray(value);
}

/**
 * Validates that a value is a nullable object.
 *
 * @param value - The value to validate.
 * @returns Whether the value is an object or not.
 */
function isObject(value) {
  return typeof value === 'object' && !isArray(value);
}


/**
 * Validates that a value is a non-null object.
 *
 * @param value - The value to validate.
 * @returns Whether the value is a non-null object or not.
 */
function isNonNullObject(value) {
  return isObject(value) && value !== null;
}



module.exports = {
  isString,
  isNonNullObject,
  isArray
}