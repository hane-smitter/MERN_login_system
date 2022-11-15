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
- Fields : email
<-- Uses Origin header to create link to application -->

- RESET PASSWORD : http://localhost:8000/api/resetpass/:resetToken
- METHOD: PATCH
*/

import http from "../utils/standardHttp";
// import request from "src/request";

export const login = (data) =>
  http.get("/login", data);
export const refreshAccessToken = () =>
  http.get("/reauth", { withCredentials: true, requireAuthHeader: true });
