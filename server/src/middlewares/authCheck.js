const jwt = require("jsonwebtoken");

const AutorizationError = require("../config/error/AuthorizationErrorConstructor.js");
const User = require("../models/User.js");

const ACCESS_TOKEN = {
  secret: process.env.AUTH_ACCESS_TOKEN_SECRET,
};

/* 
- Check if token is provided in the Authorization Header.
- `jwt.verify()` the token:
    - If token is invalid or expired, throw an `AutorizationError`.
- Check if the provided token is in the database record of its associated user.
*/
module.exports.authCheck = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader?.startsWith("Bearer "))
      throw new AutorizationError("Invalid Access Token!", 401);

    const accessTokenParts = authHeader.split(" ");
    const accessTkn = accessTokenParts[1];

    
    let user = null;
    try {
      const decoded = jwt.verify(accessTkn, ACCESS_TOKEN.secret);
      user = await User.findById(decoded._id);
    } catch (error) {
      // Rethrow error so it is captured by the outer catch block

      if (error.name === "TokenExpiredError") {
        throw new AutorizationError("Invalid Access Token!", 401, "", {
          error: "invalid_token",
          error_description: "access token expired",
        });
      }

      throw new AutorizationError("Invalid Access Token!", 401);
    }

    if (!user) throw new AutorizationError("Unauthorized", 401);

    const accessTknExists = user.tokens.findIndex(
      (tokenObj) => tokenObj.token === accessTkn
    );
    if (accessTknExists === -1)
      throw new AutorizationError("Unauthorized. Provided AT not found", 401);

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
