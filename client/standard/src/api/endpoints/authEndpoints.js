/* 
- LOGIN : http://localhost:8000/api/login
- METHOD : POST
- Fields : email, password

- SIGNUP : http://localhost:8000/api/signup
- METHOD : POST
- FIELDS : 

- LOGOUT : http://localhost:8000/api/logout
- METHOD : GET
<-- Requires Authorization Header -->

- REFRESHACCESSTOKEN : http://localhost:8000/api/reauth
- METHOD : GET
<-- Requires Authorization Header -->
<-- Requires RefreshToken Cookie sent along -->

- EMAIL PASSWORD RESET LINK : http://localhost:8000/api/forgotpass
- METHOD : POST
- FIELDS : email
<-- Uses Origin header to create link to application -->

- RESET PASSWORD : http://localhost:8000/api/resetpass/:resetToken
- METHOD: PATCH
*/

import http from "../../utils/standardHttp";

let loginController;
/**
 * Login API endpoint
 * @param {object} data - Account Credentials
 * @param {string} data.email - Email used by the account
 * @param {string} data.password - Password
 * @returns {Promise} - Axios promise object
 */
export const login = (data) => {
  loginController?.abort();
  loginController = new AbortController();
  const signal = loginController.signal;
  return http.post("/login", data, { withCredentials: true, signal });
};

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

let refreshAccessTokenController;
/**
 * Refresh Token API endpoint
 * @returns {Promise} - Axios promise object
 */
export const refreshAccessToken = () => {
  refreshAccessTokenController?.abort();
  refreshAccessTokenController = new AbortController();
  const signal = refreshAccessTokenController.signal;

  return http("/reauth", {
    method: "post",
    withCredentials: true,
    requireAuthHeader: true,
    signal,
  });
};

/**
 * Logout API endpoint
 * @returns {Promise} - No response body
 */
export const logout = () =>
  http.post("/logout", { requireAuthHeader: true, withCredentials: true });

/**
 * Logout from All Devices API endpoint
 * @returns {Promise} - No response body
 */
export const logoutEverywhere = () =>
  http.post("/master-logout", {
    requireAuthHeader: true,
    withCredentials: true,
  });

/**
 * Request password reset link API endpoint
 * @param {object} data - Account Credentials
 * @param {string} data.email - Email used by the account
 * @returns {Promise} - Axios promise object
 */
export const forgotpass = (data) => http.post("/forgotpass", data);

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
