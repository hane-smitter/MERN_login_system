import axios from "axios";

const BASEURL = "http://localhost:8000/api/";

const config = {
  baseURL: BASEURL,
};

// config.headers["cache-control"] = `no-cache`;
const http = axios.create(config);

export default http;
