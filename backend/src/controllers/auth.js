/*
 - Route handlers to create:
    - Login
    - Signup
    - Logout
    - Password Reset
    - Refresh Token
 */

const CustomError = require("../errors/customErrorConstructor");
const { validationResult } = require("express-validator");
const User = require("../models/User");

// Article explaining cookies vividly: https://web.dev/samesite-cookies-explained/
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
    const accessToken = await user.generateAuthToken();

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
  } catch (err) {
    console.log(err);
    next(err);
  }
};
