const CustomError = require("./CustomError");

class AuthorizationError extends CustomError {
  /**
   * Authorization Error Constructor
   * @param {any} [message] - Error payload
   * @param {number} [statusCode] - Status code. Defaults to `401`
   * @param {string} [feedback=""] - Feedback message
   * @param {object} [authParams] - Authorization Parameters to set in `WWW-Authenticate` header
   */
  constructor(message, statusCode = 401, feedback, authParams) {
    super(message, statusCode, feedback);
    this.authorizationError = true;
    this.authParams = authParams || {};
    this.authHeaders = {
      "WWW-Authenticate": `Bearer ${this.#stringifyAuthParams()}`,
    };
  }

  #stringifyAuthParams() {
    let str = "";

    let { realm, ...others } = this.authParams;

    realm = realm ? realm : "apps";

    str = `realm=${realm}`;

    const otherParams = Object.keys(others);
    if (otherParams.length < 1) return str;

    otherParams.forEach((authParam, index, array) => {
      // Delete other `realms` if they exist
      if (authParam.toLowerCase() === "realm") {
        delete others[authParam];
      }

      let comma = ",";
      // If is last Item
      if (array.length - 1 === index) {
        comma = "";
      }
      str = str + ` ${authParam}=${this.authParams[authParam]}${comma}`;
    });

    // console.log("--Authenticate header string constructed: -- ", str);

    return str;
  }
}

module.exports = AuthorizationError;
