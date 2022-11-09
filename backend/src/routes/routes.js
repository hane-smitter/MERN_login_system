const express = require("express");

const {
  login,
  signup,
  refreshAccessToken,
  logout,
} = require("../controllers/auth");
const { authCheck } = require("../middlewares/authCheck");
const validators = require("../validator/form-validator");

const router = express.Router();

router.get("/test", function (req, res) {
  res.send("Hello its working!!");
});

/**
 * @method - POST
 * @param - /api/login
 * @description - User Login
 */
router.post("/login", validators.loginValidator, login);

/**
 * @method - POST
 * @param - /api/signup
 * @description - User Signup
 */
router.post("/signup", validators.signupValidator, signup);

/**
 * @method - GET
 * @param - /api/logout
 * @description - Logout
 */
router.get("/logout", authCheck, logout);

/**
 * @method - GET
 * @param - /api/reauth
 * @description - Regenerate Access Token
 */
router.get("/reauth", refreshAccessToken);

/**
 * @method - POST
 * @param - /api/forgotpassword
 * @description - Send password reset email link
 */
router.post(
  "/forgotpassword",
  validators.forgotPasswordValidator,
  forgotPassword
);

module.exports = router;
