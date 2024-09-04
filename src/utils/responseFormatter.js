/**
 * Formats a success response
 * @param {object} -The data to be included in response.
 * @param {string} -A message describing the result.
 * @returns {object} -The formatter success response.
 */

function successResponse(data = null, message = "Operation successfull.") {
  return {
    success: true,
    data,
    message,
  };
}

/**
 * Formats a error response
 * @param {string} message - A message describing the error.
 * @param {string} [error] - Detailed error information(optional).
 * @returns {object} -The formatted error response.
 */

function errorResponse(message = "Operation failed.", error = null) {
  return {
    success: false,
    data: null,
    message,
    error,
  };
}

module.exports = { successResponse, errorResponse };
