import http from "../../utils/httpClient";

/**
 * Fetch Authenticated User Profile API endpoint
 * @returns {Promise} - Axios promise object
 */
export const getUserProfile = () =>
  http.get(`/me`, { requireAuthHeader: true });
