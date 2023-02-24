import { storageChangeEvent } from "./customEvent";

const storage = sessionStorage; // The storage to use

const AuthTknName = "u:Id";
const IsAuthenticatedName = "isAuthenticated";

const authStorage = {
  /**
   * Get Authentication Token(`access token`) of Authenticated user
   * @returns {string|undefined} - Aunthentication Token
   */
  get authTkn() {
    try {
      let token = storage.getItem(AuthTknName);
      if (!token) return undefined;
      token = JSON.parse(token);
      return token;
    } catch (error) {
      return undefined;
    }
  },

  /**
   * Store Authentication Token(`access token`) and set authentication status
   * @param {string} token - Aunthentication Token
   * @returns {void}
   */
  set authTkn(token) {
    // if (token) storage.setItem(AuthTknName, JSON.stringify(token));
    storage.setItem(IsAuthenticatedName, JSON.stringify(Boolean(token)));
    window.dispatchEvent(storageChangeEvent);
  },

  /**
   * @returns {boolean} - Authentication status
   */
  get isAuthenticated() {
    try {
      const isAuthenticated = JSON.parse(storage.getItem(IsAuthenticatedName));
      return Boolean(isAuthenticated);
    } catch (error) {
      return false;
    }
  },

  /**
   * @returns {void}
   */
  logout() {
    storage.removeItem(AuthTknName);
    storage.removeItem(IsAuthenticatedName);

    window.dispatchEvent(storageChangeEvent);
  },
};

export { authStorage };
