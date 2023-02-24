import http from "../../utils/httpClient";

/**
 * Login API endpoint
 * @param {object} data - Account Credentials
 * @param {string} data.email - Email used by the account
 * @param {string} data.password - Password
 * @returns {Promise} - Axios promise object
 */
export const login = (data) =>
  http.post("/login", data, { withCredentials: true });

/**
 * Signup API endpoint
 * @param {object} data - Credentials to create account
 * @param {string} data.firstName - Firstname
 * @param {string} data.lastName - Lastname
 * @param {string} data.email - Email
 * @param {string} data.password - Password
 * @returns {Promise} - Axios promise object
 */
export const signup = (data) =>
  http.post("/signup", data, { withCredentials: true });

/**
 * Refresh Token API endpoint
 * @returns {Promise} - Axios promise object
 */
export const refreshAccessToken = () =>
  http("/reauth", {
    method: "post",
    withCredentials: true,
  });

/**
 * Logout API endpoint
 * @returns {Promise} - No response body
 */
export const logout = () =>
  http.post("/logout", null, {
    withCredentials: true,
    requireAuthHeader: true,
  });

/**
 * Logout from All Devices API endpoint
 * @returns {Promise} - No response body
 */
export const logoutEveryDevice = () =>
  http.post("/master-logout", null, {
    withCredentials: true,
    requireAuthHeader: true,
  });

/**
 * Request password reset link API endpoint
 * @param {object} data - Account Credentials
 * @param {string} data.email - Email used by the account
 * @returns {Promise} - Axios promise object
 */
export const forgotpass = (data) =>
  http.post("/forgotpass", data, {
    headers: {
      "X-reset-base": `${document.location.origin}/change-pass`,
    },
  });

/**
 * Reset password API endpoint
 * @param {object} data - Account Credentials
 * @param {string} data.resetToken - Reset Token
 * @param {string} data.password - Password
 * @param {string} data.passwordConfirm - Password Confirmation
 * @returns {Promise} - Axios promise object
 */
export const resetpass = (data) => {
  const { resetToken, password, passwordConfirm } = data;

  return http.patch(`/resetpass/${resetToken}`, { password, passwordConfirm });
};
