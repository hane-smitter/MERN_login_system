/*
 - Route handlers to create:
    - Refresh Token
    - Login
    - Signup
    - Logout - remember to expire the refresh token
    - Password Reset
 */

const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const CustomError = require("../errors/customErrorConstructor");
const User = require("../models/User");

const refreshTokenSecret = process.env.AUTH_REFRESH_TOKEN_SECRET;

// Article explaining cookies samesite vividly: https://web.dev/samesite-cookies-explained/
const cookieOptions = {
  // With samesite `None` MUST also specify `secure: true`
  httpOnly: false, // Cookie won't be accessible by Javascript `document.cookie`
  sameSite: "Lax", // Lets servers specify whether/when cookies are sent with cross-site requests
  secure: false, // A cookie with the Secure attribute is only sent to the server with an encrypted request over the HTTPS protocol
  maxAge: 24 * 60 * 60 * 1000, // Age of cookie to expire in user-agent/client device
};

/* 
For this tutorial, we'll be using the popular express-validator
module to perform both validation and sanitization of our form data.
 */

// Regenerate new Access Token
module.exports.refreshAccessToken = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const authHeader = req.headers["Authorization"];
    // console.log("cookies");
    // console.log(JSON.stringify(cookies));
    // console.log(cookies?.refreshTkn);
    if (!cookies?.refreshTkn)
      throw new CustomError("Refresh Token is missing!", 401);
    if (!authHeader.startsWith("Bearer "))
      throw new CustomError("Invalid Access Token!", 401);

    const accessTokenParts = authHeader.split(" ");
    const expiredAccessTkn = accessTokenParts[1];

    if (!expiredAccessTkn) throw new CustomError("Invalid Access Token!", 401);

    const rfTkn = cookies.refreshTkn;

    // Verifying the Refresh Token
    // and decoding to get id of represented user
    const decoded = jwt.verify(rfTkn, refreshTokenSecret);

    const user = await User.findById(decoded._id);
    // Delete the expired token
    user.tokens = user.tokens.filter(
      (tokenObj) => tokenObj.token !== expiredAccessTkn
    );
    await user.save();

    //GENERATE NEW ACCESSTOKEN
    const accessToken = await user.generateAuthToken();

    // Send back new accessToken
    res.status(201).json({
      success: true,
      accessToken,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// Login user
module.exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError(errors.array(), 422);
    }

    const { email, password } = req.body;

    const user = await User.findByCredentials(email, password);

    // Create Access Token
    const accessToken = await user.generateAcessToken();

    // Create Refresh Token
    const refreshToken = await user.generateRefreshToken();

    // SET refresh Token in cookie
    res.cookie("refreshTkn", refreshToken, cookieOptions);

    // Send Response on successful Login
    res.json({
      success: true,
      user,
      accessToken,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError(errors.array(), 422);
    }

    const { firstName, lastName, email, password } = req.body;

    const newUser = new User({ firstName, lastName, email, password });

    // Save new User to DB
    await newUser.save();

    // Create Access Token
    const accessToken = await newUser.generateAcessToken();

    // Create Refresh Token
    const refreshToken = await newUser.generateRefreshToken();

    // SET refresh Token in cookie
    res.cookie("refreshTkn", refreshToken, cookieOptions);

    // Send Response on successful Login
    res.status(201).json({
      success: true,
      user: newUser,
      accessToken,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
