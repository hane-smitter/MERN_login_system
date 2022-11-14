import axios from "axios";

const BASEURL = "http://localhost:8000";

const config = {
  baseURL: BASEURL,
};

// config.headers["cache-control"] = `no-cache`;
const request = axios.create(config);

export default request;
