import http from "../../utils/standardHttp";

/**
 * Fetch User Profile API endpoint
 * @param {string} id - ID of user
 * @returns {Promise} - Axios promise object
 */
export const getUserProfile = () =>
  http.get(`/me`, { requireAuthHeader: true });
