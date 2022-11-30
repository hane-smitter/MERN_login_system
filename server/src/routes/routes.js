const express = require("express");

const {
  login,
  signup,
  refreshAccessToken,
  logout,
  resetPassword,
  forgotPassword,
  logoutAllDevices,
} = require("../controllers/user/auth");
const { fetchUserProfile } = require("../controllers/user/user");
const { authCheck } = require("../middlewares/authCheck");
const validators = require("../validator");

const router = express.Router();

router.get("/test", function (req, res) {
  res.send("Hello its working!!");
});
router.all("/longwait", function (req, res) {
  // res.send("Unening wait!!");
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
 * @method - POST
 * @param - /api/logout
 * @description - Logout
 */
router.post("/logout", authCheck, logout);

/**
 * @method - POST
 * @param - /api/master-logout
 * @description - Logout from all devices
 */
 router.post("/master-logout", authCheck, logoutAllDevices);

/**
 * @method - POST
 * @param - /api/reauth
 * @description - Regenerate Access Token
 */
router.post("/reauth", refreshAccessToken);

/**
 * @method - POST
 * @param - /api/forgotpass
 * @description - Send password reset email link
 */
router.post("/forgotpass", validators.forgotPasswordValidator, forgotPassword);

/**
 * @method - POST
 * @param - /api/resetpass
 * @description - Reset password
 */
router.patch(
  "/resetpass/:resetToken",
  validators.resetPasswordValidator,
  resetPassword
);

/**
 * @method - GET
 * @param - /u/:id
 * @description - Fetch user profile
 */
router.get(
  "/u/:id",
  authCheck,
  validators.fetchUserProfileValidator,
  fetchUserProfile
);

module.exports = router;
