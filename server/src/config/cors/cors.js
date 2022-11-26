// Allow list required to explicitly set `Access-Control-Allow-Origin` response header so as to pass
// `access control check` in browsers during cross origin requests sending along cookies

// `Access-Control-Allow-Credentials` header required to be set to `true` for requests sending along
// cookies

// `Access-Control-Expose-Headers` header to make `WWW-Authenticate` header available via scripts
// in browsers so we can check for a request that needs (re)authentication.

const allowlist = ["http://localhost:3000", "http://localhost:8000"];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowlist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  exposedHeaders: ["WWW-Authenticate"],
};

module.exports = corsOptions;
