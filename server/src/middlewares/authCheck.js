const jwt = require("jsonwebtoken");

const AuthorizationError = require("../config/errors/AuthorizationError.js");
const User = require("../models/User.js");

// Pull in Environment variables
const ACCESS_TOKEN = {
  secret: process.env.AUTH_ACCESS_TOKEN_SECRET,
};

/* 
- Check if token is provided in the Authorization Header.
- `jwt.verify()` the token:
    - If token is invalid or expired, throw an `AuthorizationError`.
- Check if the provided token is in the database record of its associated user.
*/
module.exports.requireAuthentication = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader?.startsWith("Bearer "))
      throw new AuthorizationError(
        "Authentication Error",
        "You are unauthenticated!",
        {
          error: "invalid_access_token",
          error_description: "access token error",
        }
      );

    const accessTokenParts = authHeader.split(" ");
    const accessTkn = accessTokenParts[1];

    let user = null;
    try {
      const decoded = jwt.verify(accessTkn, ACCESS_TOKEN.secret);
      user = await User.findById(decoded._id);
    } catch (error) {
      // Rethrow error so it is captured by the outer `catch() {...}` block

      if (error.name === "TokenExpiredError") {
        throw new AuthorizationError(
          "Authentication Error",
          "You are unauthenticated!",
          {
            error: "expired_access_token",
            error_description: "access token is expired",
          }
        );
      }

      throw new AuthorizationError(
        "Authentication Error",
        "You are unauthenticated!"
      );
    }

    if (!user)
      throw new AuthorizationError(
        "Authentication Error",
        "You are unauthenticated!",
        {
          error: "entity_miss",
          error_description: "unknown access token",
        }
      );

    const accessTknExists = user.tokens.findIndex(
      (tokenObj) => tokenObj.token === accessTkn
    );
    if (accessTknExists === -1)
      throw new AuthorizationError(
        "Authentication Error",
        "You are unauthenticated!",
        {
          error: "unclaimed_access_token",
          error_description: "forsaken access token",
        }
      );

    // Attach authenticated user and Access Token to request object
    req.user = user;
    req.token = accessTkn;
    next();
  } catch (err) {
    // Authentication didn't go well
    console.log(err);
    next(err);
  }
};
