const storage = sessionStorage;

const browserStorage = {
  /**
   * @returns {string|undefined} - Access Token
   */
  get authTkn() {
    let token = storage.getItem("u:Id");

    if (token) {
      token = JSON.parse(token);
    }

    return token;
  },
  /**
   * @param {string} token - Access Token
   * @returns {void}
   */
  set setAuthTkn(token) {
    storage.setItem("u:Id", JSON.stringify(token));
  },
  deleteAuthTkn() {
    storage.clear();
  },
};

export { browserStorage };
