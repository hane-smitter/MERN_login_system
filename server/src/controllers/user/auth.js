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
const crypto = require("node:crypto");
const AutorizationError = require("../../config/error/AuthorizationErrorConstructor");

const CustomError = require("../../config/error/customErrorConstructor");
const User = require("../../models/User");
const { sendEmail } = require("../../services/email/sendEmail");

const RESET_PASSWORD_TOKEN = {
  secret: process.env.RESET_PASSWORD_TOKEN_SECRET,
  expiry: process.env.RESET_PASSWORD_TOKEN_EXPIRY_MINS,
};

const REFRESH_TOKEN = {
  secret: process.env.AUTH_REFRESH_TOKEN_SECRET,
  cookieName: "refreshTkn",
  // Article explaining cookies samesite vividly: https://web.dev/samesite-cookies-explained/
  cookieOptions: {
    // With samesite `None` MUST also specify `secure: true`
    httpOnly: false, // Cookie won't be accessible by Javascript `document.cookie`
    sameSite: "None", // Lets servers specify whether/when cookies are sent with cross-site requests
    secure: true, // A cookie with the Secure attribute is only sent to the server with an encrypted request over the HTTPS protocol
    maxAge: 24 * 60 * 60 * 1000, // Age of cookie to expire in user-agent/client device
  },
};

const ACCESS_TOKEN = {
  secret: process.env.AUTH_ACCESS_TOKEN_SECRET,
};

/* 
For this tutorial, we'll be using the popular express-validator
module to perform both validation and sanitization of our form data.
 */

/* REGENERATE NEW ACCESS TOKEN */
// - This route will require authorization header,
// so the header can be removed from DB if it is expired

/* 
- Check if Refresh Cookie is provided in the cookies.
- Check if Access Token is provided in the Authorization Header.
- `jwt.verify()` the Access Token:
    - If Access Token is invalid, throw a `CustomError`.
- `jwt.verify()` the Refresh Token:
    - If Refresh Token is invalid, throw a `CustomError`.
    - Check if _id of decoded Refresh Token User exists and has the `expiredAccessToken`.
    - If Expired or Not, remove Received Access Token from DB record of associated user.
- Generate a New Access Token and store it in the DB record of user that is currently authenticating.
*/
module.exports.refreshAccessToken = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const authHeader = req.header("Authorization");

    console.log("Cookiez -> ", cookies);
    console.log("Auth Header -> ", authHeader);

    if (!cookies[REFRESH_TOKEN.cookieName])
      throw new CustomError("Refresh Token is missing!", 401, "Unauthorized");
    if (!authHeader?.startsWith("Bearer ")) {
      throw new CustomError("Invalid Access Token!", 401, "Unauthorized!");
    }

    const accessTokenParts = authHeader.split(" ");
    const expiredAccessTkn = accessTokenParts[1];

    // Verify if expiredAccessTkn is a valid token
    const decodedExpiredAccessTkn = jwt.verify(
      expiredAccessTkn,
      ACCESS_TOKEN.secret,
      {
        ignoreExpiration: true,
      }
    );

    const rfTkn = cookies[REFRESH_TOKEN.cookieName];

    // Verifying the Refresh Token
    // and decoding to get id of represented user
    const decodedRefreshTkn = jwt.verify(rfTkn, REFRESH_TOKEN.secret);

    // Find user by ID gotten from refresh token in the DB
    // whose record has the `expired access token` listed
    // which we are ensuring the `expired access token` received in this endpoint
    // was assigned to this user that wants to get new token
    const userWithRefreshTkn = await User.findOne({
      _id: decodedRefreshTkn._id,
      "tokens.token": expiredAccessTkn,
    });
    console.log("decodedRefreshTkn: ", decodedRefreshTkn);
    console.log("expiredAccessTkn: ", decodedExpiredAccessTkn);
    console.log("userWithRefreshTkn: ", userWithRefreshTkn);

    if (!userWithRefreshTkn) {
      throw new CustomError(
        "Access Token Identity Mismatch!",
        401,
        "Unauthorized!"
      );
    }
    // Delete the expired token
    console.log("Removing Expired Tkn from DB in refresh handler...");
    userWithRefreshTkn.tokens = userWithRefreshTkn.tokens.filter(
      (tokenObj) => tokenObj.token !== expiredAccessTkn
    );
    await userWithRefreshTkn.save();
    console.log("...Tkn removED!");

    // GENERATE NEW ACCESSTOKEN -- it is also saved in DB
    const accessToken = await userWithRefreshTkn.generateAcessToken();

    // Send back new created accessToken
    res.status(201);
    res.set({ "Cache-Control": "no-store", Pragma: "no-cache" });
    res.json({
      success: true,
      accessToken,
    });
  } catch (err) {
    console.log(err);
    if (err?.name === "JsonWebTokenError") {
      return next(
        new AutorizationError(err, "", { error_desc: "missing token" })
      );
    }
    next(err);
  }
};

/* SIGNUP USER */
module.exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError(errors.array(), 422, errors.array()[0]?.msg);
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
      REFRESH_TOKEN.cookieName,
      refreshToken,
      REFRESH_TOKEN.cookieOptions
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
      throw new CustomError(errors.array(), 422, errors.array()[0]?.msg);
    }

    const { email, password } = req.body;

    // If user is not found, an error is thrown
    const user = await User.findByCredentials(email, password);

    // Create Access Token
    const accessToken = await user.generateAcessToken();

    // Create Refresh Token
    const refreshToken = await user.generateRefreshToken();

    // SET refresh Token in cookie
    res.cookie(
      REFRESH_TOKEN.cookieName,
      refreshToken,
      REFRESH_TOKEN.cookieOptions
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
    const expireCookieOptions = Object.assign({}, REFRESH_TOKEN.cookieOptions, {
      maxAge: 0,
    });
    // Clear the refresh token cookie
    res.cookie(REFRESH_TOKEN.cookieName, "", expireCookieOptions);
    res.status(205).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
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
    if (!user) throw new CustomError("Email not sent", 404);

    const resetToken = await user.generateResetToken();
    const origin = req.header("Origin");

    const resetUrl = `${origin}/passwordreset/${resetToken}`;

    const message = `
            <h1>You have requested a password reset</h1>
            <p>You are receiving this because you have requested to reset password for your account.<br/>
              Please click on the following link, or paste in your browser to complete the password reset.
            </p>
            <p>
              <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
            </p>
            <p>
              <em>
                This password reset link will <strong>expire after ${
                  process.env.RESET_PASSWORD_TOKEN_EXPIRY_MINS || 5
                } minutes.</strong>
              </em>
            </p>
        `;
    try {
      await sendEmail({
        to: user.email,
        html: message,
        subject: "Reset password",
      });

      res.json({
        message:
          "An email has been sent to your email address. Check your email, and visit the link to reset your password",
        success: true,
      });
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

module.exports.resetPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError(errors.array(), 422);
    }

    const resetToken = req.params.resetToken;
    const decryptedResetToken = crypto
      .createHmac("sha256", RESET_PASSWORD_TOKEN.secret)
      .update(resetToken)
      .digest("hex");
    console.log({ decryptedResetToken });
    const user = await User.findOne({
      resetpasswordtoken: decryptedResetToken,
      resetpasswordtokenexpiry: { $gt: Date.now() },
    });
    if (!user) throw new CustomError("The reset link is invalid", 400);

    user.password = req.body.password;
    user.resetpasswordtoken = undefined;
    user.resetpasswordtokenexpiry = undefined;

    await user.save();
    res.json({
      message: "Password reset successful",
      success: true,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
