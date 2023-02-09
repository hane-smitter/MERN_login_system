import http from "../../utils/httpClient";

/**
 * Fetch User Profile API endpoint
 * @param {string} id - ID of user
 * @returns {Promise} - Axios promise object
 */
export const getUserProfile = () =>
  http.get(`/me`, { requireAuthHeader: true });
