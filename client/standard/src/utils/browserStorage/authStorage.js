const storage = sessionStorage;

const AuthTknName = "u:Id";
const IsAuthenticatedName = "isAuthenticated";

const authStorage = {
  /**
   * @returns {string|undefined} - Access Token
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
   * @param {string} token - Aunthentication Token
   * @description - persists aunthentication token and sets authentication status
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
    storage.clear();
  },
};

export { authStorage };
