const CustomError = require("./customErrorConstructor");

class AutorizationError extends CustomError {
  /**
   * Custom Error Constructor with additional methods
   * @param {any} [message] - Optional error payload
   * @param {number} [statusCode] - Optional error http status code
   * @param {string} [feedback=""] - Optional feedback message you want to provide
   * @param {object} [authParams] - Authorization Parameters to set in `WWW-Authenticate` header
   */
  constructor(message, statusCode, feedback, authParams = { realm: "app" }) {
    super(message, statusCode, feedback);
    this.authorizationError = true;
    this.authParams = authParams;
    this.authHeaders = {
      "WWW-Authenticate": `Bearer ${this.#stringifyAuthParams()}`,
    };
  }

  #stringifyAuthParams() {
    let str = "";

    const { realm, ...others } = this.authParams;

    if (realm) {
      // Delete other `realms` if they exist
      Object.keys(others).forEach((authParam) => {
        if (authParam.toLowerCase() === "realm") {
          delete others[authParam];
        }
      });
    }

    str = `realm=${realm}`;

    Object.keys(others).forEach((authParam, index, array) => {
      let comma = ",";
      if (array.length - 1 === index) {
        comma = "";
      }
      str = str + `,${authParam}=${this.authParams[authParam]}${comma}`;
    });

    console.log("Authenticate header string returned: ", str);

    return str;
  }
}

module.exports = AutorizationError;
