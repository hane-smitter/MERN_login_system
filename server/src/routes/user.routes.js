const express = require("express");

const validators = require("../validators");
const userControllers = require("../controllers/user");
const { requireAuthentication } = require("../middlewares/authCheck");

const router = express.Router();

// TEST Route
router.get("/", function (req, res) {
  res.send("Hello /api/users routing works 🥂!!");
});

/**
 * @method - POST
 * @param {string} path - /api/users/login
 * @description - User Login
 */
router.post("/login", validators.loginValidator, userControllers.login);

/**
 * @method - POST
 * @param {string} path - /api/users/signup
 * @description - User Signup
 */
router.post("/signup", validators.signupValidator, userControllers.signup);

/**
 * @method - POST
 * @param {string} path - /api/users/logout
 * @description - User Logout
 */
router.post("/logout", requireAuthentication, userControllers.logout);

/**
 * @method - POST
 * @param {string} path - /api/users/master-logout
 * @description - User Logout from all devices
 */
router.post(
  "/master-logout",
  requireAuthentication,
  userControllers.logoutAllDevices
);

/**
 * @method - POST
 * @param {string} path - /api/users/reauth
 * @description - Refresh Access Token
 */
router.post("/reauth", userControllers.refreshAccessToken);

/**
 * @method - POST
 * @param {string} path - /api/users/forgotpass
 * @description - Send password reset email link
 */
router.post(
  "/forgotpass",
  validators.forgotPasswordValidator,
  userControllers.forgotPassword
);

/**
 * @method - POST
 * @param {string} path - /api/users/resetpass
 * @description - Reset password
 */
router.patch(
  "/resetpass/:resetToken",
  validators.resetPasswordValidator,
  userControllers.resetPassword
);

/**
 * @method - GET
 * @param {string} path - /api/users/me
 * @description - Get authenticated user
 */
router.get("/me", requireAuthentication, userControllers.fetchAuthUserProfile);

/**
 * @method - GET
 * @param {string} path - /api/users/:id
 * @description - Get user by ID
 */
router.get(
  "/:id",
  requireAuthentication,
  validators.fetchUserProfileValidator,
  userControllers.fetchUserProfile
);

module.exports = router;
