class CustomError extends Error {
  /**
   * Custom Error Constructor with additional methods
   * @param {any} message - Error payload
   * @param {number} statusCode - Error http status code
   */
  constructor(message, statusCode) {
    super(message);
    this.status = statusCode;
    this.cause = message;
  }
}

module.exports = CustomError;
