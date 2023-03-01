const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../../models/User");
const { sendEmail } = require("../../services/email/sendEmail");
const CustomError = require("../../config/errors/CustomError");
const AuthorizationError = require("../../config/errors/AuthorizationError");

// Top-level constants
const REFRESH_TOKEN = {
  secret: process.env.AUTH_REFRESH_TOKEN_SECRET,
  cookie: {
    name: "refreshTkn",
    options: {
      sameSite: "None",
      secure: true,
      httpOnly: false,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  },
};
// const ACCESS_TOKEN = {
//   secret: process.env.AUTH_ACCESS_TOKEN_SECRET,
// };
const RESET_PASSWORD_TOKEN = {
  expiry: process.env.RESET_PASSWORD_TOKEN_EXPIRY_MINS,
};

/*
  1. LOGIN USER
*/
module.exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError(errors.array(), 422, errors.array()[0]?.msg);
    }

    const { email, password } = req.body;

    /* Custom methods on user are defined in User model */
    const user = await User.findByCredentials(email, password); // Identify and retrieve user by credentials
    const aTkn = await user.generateAcessToken(); // Create Access Token
    const refreshToken = await user.generateRefreshToken(); // Create Refresh Token

    // SET refresh Token cookie in response
    res.cookie(
      REFRESH_TOKEN.cookie.name,
      refreshToken,
      REFRESH_TOKEN.cookie.options
    );

    // Send Response on successful Login
    res.json({
      success: true,
      user,
      accessToken: aTkn,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/*
  2. SIGN UP USER 
*/
module.exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError(errors.array(), 422, errors.array()[0]?.msg);
    }
    const { firstName, lastName, email, password } = req.body;

    /* Custom methods on newUser are defined in User model */
    const newUser = new User({ firstName, lastName, email, password });
    await newUser.save(); // Save new User to DB
    const aTkn = await newUser.generateAcessToken(); // Create Access Token
    const refreshToken = await newUser.generateRefreshToken(); // Create Refresh Token

    // SET refresh Token cookie in response
    res.cookie(
      REFRESH_TOKEN.cookie.name,
      refreshToken,
      REFRESH_TOKEN.cookie.options
    );

    // Send Response on successful Sign Up
    res.status(201).json({
      success: true,
      user: newUser,
      accessToken: aTkn,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/*
  3. LOGOUT USER
*/
module.exports.logout = async (req, res, next) => {
  try {
    // Authenticated user ID attached on `req` by authentication middleware
    const userId = req.userId;
    const user = await User.findById(userId);

    const cookies = req.cookies;
    // const authHeader = req.header("Authorization");
    const refreshToken = cookies[REFRESH_TOKEN.cookie.name];
    // Create a access token hash
    const rTknHash = crypto
      .createHmac("sha256", REFRESH_TOKEN.secret)
      .update(refreshToken)
      .digest("hex");
    user.tokens = user.tokens.filter((tokenObj) => tokenObj.token !== rTknHash);
    await user.save();

    // Set cookie expiry to past date so it is destroyed
    const expireCookieOptions = Object.assign(
      {},
      REFRESH_TOKEN.cookie.options,
      {
        expires: new Date(1),
      }
    );

    // Destroy refresh token cookie
    res.cookie(REFRESH_TOKEN.cookie.name, "", expireCookieOptions);
    res.status(205).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/*
  4. LOGOUT USER FROM ALL DEVICES
*/
module.exports.logoutAllDevices = async (req, res, next) => {
  try {
    // Authenticated user ID attached on `req` by authentication middleware
    const userId = req.userId;
    const user = await User.findById(userId);

    user.tokens = undefined;
    await user.save();

    // Set cookie expiry to past date to mark for destruction
    const expireCookieOptions = Object.assign(
      {},
      REFRESH_TOKEN.cookie.options,
      {
        expires: new Date(1),
      }
    );

    // Destroy refresh token cookie
    res.cookie(REFRESH_TOKEN.cookie.name, "", expireCookieOptions);
    res.status(205).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/*
  5. REGENERATE NEW ACCESS TOKEN
*/
module.exports.refreshAccessToken = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    // const authHeader = req.header("Authorization");
    const refreshToken = cookies[REFRESH_TOKEN.cookie.name];

    if (!refreshToken) {
      throw new AuthorizationError(
        "Authentication error!",
        undefined,
        "You are unauthenticated",
        {
          realm: "reauth",
          error: "no_rft",
          error_description: "Refresh Token is missing!",
        }
      );
    }

    const decodedRefreshTkn = jwt.verify(refreshToken, REFRESH_TOKEN.secret);
    const rTknHash = crypto
      .createHmac("sha256", REFRESH_TOKEN.secret)
      .update(refreshToken)
      .digest("hex");
    const userWithRefreshTkn = await User.findOne({
      _id: decodedRefreshTkn._id,
      "tokens.token": rTknHash,
    });
    if (!userWithRefreshTkn)
      throw new AuthorizationError(
        "Authentication Error",
        undefined,
        "You are unauthenticated!",
        {
          realm: "reauth",
        }
      );

    // GENERATE NEW ACCESSTOKEN
    const newAtkn = await userWithRefreshTkn.generateAcessToken();
    // GENERATE NEW REFRESHTOKEN
    // const newRtkn = await userWithRefreshTkn.generateRefreshToken();

    res.status(201);
    res.set({ "Cache-Control": "no-store", Pragma: "no-cache" });

    // Send response with NEW accessToken
    res.json({
      success: true,
      accessToken: newAtkn,
    });
  } catch (error) {
    console.log(error);
    if (error?.name === "JsonWebTokenError")
      return next(
        new AuthorizationError(error, undefined, "You are unauthenticated", {
          realm: "reauth",
          error_description: "token error",
        })
      );
    next(error);
  }
};

/*
  6. FORGOT PASSWORD
*/
module.exports.forgotPassword = async (req, res, next) => {
  const MSG = `If ${req.body?.email} is found with us, we've sent an email to it with instructions to reset your password.`;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError(errors.array(), 422);
    }

    const email = req.body.email;

    const user = await User.findOne({ email });
    // If email is not found, we throw an exception BUT with 200 status code
    // because it is a security vulnerability to inform users
    // that the Email is not found.
    // To avoid username enumeration attacks, no extra response data is provided when an email is successfully sent. (The same response is provided when the username is invalid.)
    if (!user) throw new CustomError("Reset link sent", 200, MSG);

    let resetToken = await user.generateResetToken();
    resetToken = encodeURIComponent(resetToken);

    const resetPath = req.header("X-reset-base");
    const origin = req.header("Origin");

    const resetUrl = resetPath
      ? `${resetPath}/${resetToken}`
      : `${origin}/resetpass/${resetToken}`;
    console.log("Password reset URL: %s", resetUrl);

    const emailMessage = `
            <h1>You have requested to change your password</h1>
            <p>You are receiving this because someone(hopefully you) has requested to reset password for your account.<br/>
              Please click on the following link, or paste in your browser to complete the password reset.
            </p>
            <p>
              <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
            </p>
            <p>
              <em>
                If you did not request this, you can safely ignore this email and your password will remain unchanged.
              </em>
            </p>
            <p>
            <strong>DO NOT share this link with anyone else!</strong><br />
              <small>
                <em>
                  This password reset link will <strong>expire after ${
                    RESET_PASSWORD_TOKEN.expiry || 5
                  } minutes.</strong>
                </em>
              <small/>
            </p>
        `;

    try {
      await sendEmail({
        to: user.email,
        html: emailMessage,
        subject: "Reset password",
      });

      res.json({
        message: "Reset link sent",
        feedback: MSG,
        success: true,
      });
    } catch (error) {
      user.resetpasswordtoken = undefined;
      user.resetpasswordtokenexpiry = undefined;
      await user.save();

      console.log(error.message);
      throw new CustomError("Internal issues standing in the way", 500);
    }
  } catch (err) {
    next(err);
  }
};

/*
  7. RESET PASSWORD
*/
module.exports.resetPassword = async (req, res, next) => {
  try {
    console.log("req.params: ", req.params);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError(errors.array(), 422);
    }

    const resetToken = new String(req.params.resetToken);

    const [tokenValue, tokenSecret] = decodeURIComponent(resetToken).split("+");

    console.log({ tokenValue, tokenSecret });

    // Recreate the reset Token hash
    const resetTokenHash = crypto
      .createHmac("sha256", tokenSecret)
      .update(tokenValue)
      .digest("hex");

    const user = await User.findOne({
      resetpasswordtoken: resetTokenHash,
      resetpasswordtokenexpiry: { $gt: Date.now() },
    });
    if (!user) throw new CustomError("The reset link is invalid", 400);
    console.log(user);

    user.password = req.body.password;
    user.resetpasswordtoken = undefined;
    user.resetpasswordtokenexpiry = undefined;

    await user.save();

    // Email to notify owner of the account
    const message = `<h3>This is a confirmation that you have changed Password for your account.</h3>`;
    // No need to await
    sendEmail({
      to: user.email,
      html: message,
      subject: "Password changed",
    });

    res.json({
      message: "Password reset successful",
      success: true,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
