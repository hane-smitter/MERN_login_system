import axios from "axios";

const BASEURL = "http://localhost:8000/api/users";

const config = {
  baseURL: BASEURL,
  timeout: 20000,
  timeoutErrorMessage: "Waiting for too long...Aborted !",
};

// config.headers["cache-control"] = `no-cache`;
const http = axios.create(config);

export default http;
