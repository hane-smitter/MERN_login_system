const jwt = require("jsonwebtoken");

const CustomError = require("../errors/customErrorConstructor.js");
const User = require("../models/User.js");

const accessTokenSecret = process.env.AUTH_ACCESS_TOKEN_SECRET;

module.exports.authCheck = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader?.startsWith("Bearer "))
      throw new CustomError("Invalid Access Token!", 401);

    const accessTokenParts = authHeader.split(" ");
    const accessTkn = accessTokenParts[1];

    if (!accessTkn) throw new CustomError("Invalid Access Token!!", 401);
    let user = null;

    try {
      const decoded = jwt.verify(accessTkn, accessTokenSecret);
      user = await User.findById(decoded._id);
    } catch (error) {
      // Rethrow error so it is captured by the outer catch block

      // Remove Expired Token from DB
      if (error.name === "TokenExpiredError") {
        const decoded = jwt.verify(accessTkn, accessTokenSecret, {
          ignoreExpiration: true,
        });
        const userWithExpiredTkn = await User.findById(decoded._id);
        if (userWithExpiredTkn) {
          console.log("An Expired Tkn. Removing from DB...");
          userWithExpiredTkn.tokens = userWithExpiredTkn.tokens.filter(
            (tknObj) => tknObj.token !== accessTkn
          );
          await userWithExpiredTkn.save();
        }
      }

      throw new CustomError("Invalid Access Token!", 401);
    }

    if (!user) throw new CustomError("Unauthorized", 401);

    const accessTknExists = user.tokens.findIndex(
      (tokenObj) => tokenObj.token === accessTkn
    );
    if (accessTknExists === -1)
      throw new CustomError("Unauthorized. Provided AT not in DB", 401);

    // Attach authenticated user and Access Token to request object
    req.user = user;
    req.token = accessTkn;
    next();
  } catch (err) {
    // Things didn't go well
    next(err);
  }
};
