import axios from "axios";

const BASEURL = "http://localhost:8000/api/users";
const TIMEOUTMSG = "Waiting for too long...Aborted !";

const config = {
  baseURL: BASEURL,
  timeout: 20000,
  timeoutErrorMessage: TIMEOUTMSG,
};

// config.headers["cache-control"] = `no-cache`;
const http = axios.create(config);

export default http;
