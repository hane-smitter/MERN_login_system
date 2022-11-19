const jwt = require("jsonwebtoken");

const AuthorizationError = require("../config/error/AuthorizationErrorConstructor.js");
const User = require("../models/User.js");

const ACCESS_TOKEN = {
  secret: process.env.AUTH_ACCESS_TOKEN_SECRET,
};

/* 
- Check if token is provided in the Authorization Header.
- `jwt.verify()` the token:
    - If token is invalid or expired, throw an `AuthorizationError`.
- Check if the provided token is in the database record of its associated user.
*/
module.exports.authCheck = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader?.startsWith("Bearer "))
      throw new AuthorizationError(
        "Invalid Access Token!",
        "You are unauthorized!",
        {
          realm: "appp",
          error: "no_auth_token",
          error_description: "missing access token",
        }
      );

    const accessTokenParts = authHeader.split(" ");
    const accessTkn = accessTokenParts[1];

    let user = null;
    try {
      const decoded = jwt.verify(accessTkn, ACCESS_TOKEN.secret);
      user = await User.findById(decoded._id);
    } catch (error) {
      // Rethrow error so it is captured by the outer catch block

      if (error.name === "TokenExpiredError") {
        throw new AuthorizationError("Invalid Access Token!", "Unauthorized", {
          error: "invalid_token",
          error_description: "access token expired",
        });
      }

      throw new AuthorizationError("Invalid Access Token!", "Unauthorized");
    }

    if (!user) throw new AuthorizationError("No record", "Unauthorized");

    const accessTknExists = user.tokens.findIndex(
      (tokenObj) => tokenObj.token === accessTkn
    );
    if (accessTknExists === -1)
      throw new AuthorizationError(
        "Unauthorized. Provided AT not found",
        "Unauthorized"
      );

    // Attach authenticated user and Access Token to request object
    req.user = user;
    req.token = accessTkn;
    next();
  } catch (err) {
    // Things didn't go well
    console.log(err);
    next(err);
  }
};
