const storage = sessionStorage;

const AuthTknName = "u:Id";
const IsAuthenticatedName = "isAuthenticated";

const authStorage = {
  /**
   * Get Authentication Token(`access token`) of Authenticated user
   * @returns {string|undefined} - Aunthentication Token
   */
  get authTkn() {
    let token = storage.getItem(AuthTknName);
    if (token) {
      token = JSON.parse(token);
      return token;
    }

    return undefined;
  },

  /**
   * Store Authentication Token(`access token`) and set authentication status
   * @param {string} token - Aunthentication Token
   * @returns {void}
   */
  set authTkn(token) {
    if (token) {
      storage.setItem(AuthTknName, JSON.stringify(token));
      storage.setItem(IsAuthenticatedName, JSON.stringify(true));
    } else {
      storage.setItem(IsAuthenticatedName, JSON.stringify(false));
    }
  },

  /**
   * @returns {boolean} - Authentication status
   */
  get isAuthenticated() {
    let isAuthenticated = JSON.parse(storage.getItem(IsAuthenticatedName));

    return Boolean(isAuthenticated);
  },

  /**
   * @returns {void}
   */
  logout() {
    storage.removeItem(AuthTknName);
    storage.removeItem(IsAuthenticatedName);
  },
};

export { authStorage };
