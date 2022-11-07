const jwt = require("jsonwebtoken");

const CustomError = require("../errors/customErrorConstructor.js");
const User = require("../models/User.js");

const accessTokenSecret = process.env.AUTH_ACCESS_TOKEN_SECRET;

module.exports.authCheck = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader.startsWith("Bearer "))
      throw new CustomError("Invalid Access Token!", 401);

    const accessTokenParts = authHeader.split(" ");
    const accessTkn = accessTokenParts[1];

    if (!accessTkn) throw new CustomError("Invalid Access Token!!", 401);

    const decoded = jwt.verify(accessTkn, accessTokenSecret);
    const user = await User.findById(decoded._id);

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
    next(err);
  }
};
