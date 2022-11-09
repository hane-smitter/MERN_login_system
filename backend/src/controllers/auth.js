/*
 - Route handlers to create:
    - Refresh Access Token
    - Login
    - Signup
    - Logout - remember to expire the refresh token
              - To logout, remove the access token from DB along with client side
    - Password Reset
 */

const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const CustomError = require("../errors/customErrorConstructor");
const User = require("../models/User");
const { sendEmail } = require("../services/email/sendEmail");

const REFRESH_TOKEN_COOKIE = {
  name: "refreshTkn",
  secret: process.env.AUTH_REFRESH_TOKEN_SECRET,
  // Article explaining cookies samesite vividly: https://web.dev/samesite-cookies-explained/
  cookieOptions: {
    // With samesite `None` MUST also specify `secure: true`
    httpOnly: false, // Cookie won't be accessible by Javascript `document.cookie`
    sameSite: "Lax", // Lets servers specify whether/when cookies are sent with cross-site requests
    secure: false, // A cookie with the Secure attribute is only sent to the server with an encrypted request over the HTTPS protocol
    maxAge: 24 * 60 * 60 * 1000, // Age of cookie to expire in user-agent/client device
  },
};

/* 
For this tutorial, we'll be using the popular express-validator
module to perform both validation and sanitization of our form data.
 */

/* REGENERATE NEW ACCESS TOKEN */
// - This route will require authorization header,
// so the header can be removed from DB if it is expired
module.exports.refreshAccessToken = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const authHeader = req.headers["authorization"];
    if (!cookies[REFRESH_TOKEN_COOKIE.name])
      throw new CustomError("Refresh Token is missing!", 422);
    if (!authHeader?.startsWith("Bearer "))
      throw new CustomError("Invalid Access Token!", 422);

    const accessTokenParts = authHeader.split(" ");
    const expiredAccessTkn = accessTokenParts[1];

    if (!expiredAccessTkn) throw new CustomError("Invalid Access Token!", 422);

    const rfTkn = cookies[REFRESH_TOKEN_COOKIE.name];

    // Verifying the Refresh Token
    // and decoding to get id of represented user
    const decoded = jwt.verify(rfTkn, REFRESH_TOKEN_COOKIE.secret);

    const user = await User.findById(decoded._id);
    // Delete the expired token
    user.tokens = user.tokens.filter(
      (tokenObj) => tokenObj.token !== expiredAccessTkn
    );
    await user.save();

    //GENERATE NEW ACCESSTOKEN
    const accessToken = await user.generateAcessToken();

    // Send back new created accessToken
    res.status(201).json({
      success: true,
      accessToken,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

/* SIGNUP USER */
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
    res.cookie(
      REFRESH_TOKEN_COOKIE.name,
      refreshToken,
      REFRESH_TOKEN_COOKIE.cookieOptions
    );

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

/* LOGIN USER */
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
    res.cookie(
      REFRESH_TOKEN_COOKIE.name,
      refreshToken,
      REFRESH_TOKEN_COOKIE.cookieOptions
    );

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

/* LOGOUT USER */
module.exports.logout = async (req, res, next) => {
  try {
    // `req.user` comes from middleware that restricts
    // routes to only authenticated users
    const user = req.user;

    // Strip access priviledges of an AccessToken
    // by deleting its entry from the DB
    const aTkn = req.token;
    user.tokens = user.tokens.filter((tokenObj) => tokenObj.token !== aTkn);
    await user.save();

    // Expire the refresh token
    // `max-age` takes precedence over `expires` if both are stated in cookie options.
    // But express converts the option `maxAge` to `expires`.
    const expireCookieOptions = Object.assign(
      {},
      REFRESH_TOKEN_COOKIE.cookieOptions,
      { maxAge: 0 }
    );
    // Clear the refresh token cookie
    res.cookie(REFRESH_TOKEN_COOKIE.name, "", expireCookieOptions);
    res.status(205).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.forgotPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError(errors.array(), 422);
    }

    const email = req.body.email;

    const user = await User.findOne({ email });
    if (!user) throw new ErrorResponse("Email not sent", 404);

    const resetToken = await user.generateResetToken();
    const origin = req.header("Origin");

    console.log("request origin ", origin);

    const resetUrl = `${origin}/passwordreset/${resetToken}`;

    const message = `
            <h1>You have requested a password reset</h1>
            <p>Please go to this link to reset your password.</p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
            <p>This password reset link will <strong>expire after ${
              process.env.EMAIL_RESET_PASSWORD_TOKEN_EXPIRY_MINS || 5
            } minutes.</strong></p>
        `;
    try {
      await sendEmail({
        to: user.email,
        html: message,
        subject: "Reset password",
      });

      let info = {
        message:
          "An email has been sent to your email address. Check your email, and visit the link to reset your password",
        severity: "success",
        code: "REGULAR_USER_FORGOTPASSWORD_RESET_EMAIL",
      };
      res.json(info);
    } catch (err) {
      user.resetpasswordtoken = undefined;
      user.resetpasswordtokenexpiry = undefined;
      await user.save();
      throw new CustomError("Email not sent", 500);
    }
  } catch (err) {
    next(err);
  }
};
