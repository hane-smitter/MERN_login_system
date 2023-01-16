const CustomError = require("./CustomError");

class AuthorizationError extends CustomError {
  /**
   * Authorization Error Constructor(fixed to status code `401`)
   * @param {any} [message] - Optional error payload
   * @param {string} [feedback=""] - Optional feedback message you want to provide
   * @param {object} [authParams] - Authorization Parameters to set in `WWW-Authenticate` header
   */
  constructor(message, feedback, authParams = {}) {
    super(message, 401, feedback);
    this.authorizationError = true;
    this.authParams = authParams;
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

    // console.log("--Authenticate header string returned: -- ", str);

    return str;
  }
}

module.exports = AuthorizationError;
