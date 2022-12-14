const express = require("express");

const usersController = require("../controllers/user");
const { requireAuthentication } = require("../middlewares/authCheck");
const validators = require("../validators");

const router = express.Router();

router.get("/test", function (req, res) {
  res.send("Hello its working!!");
});

/**
 * @method - POST
 * @param - /api/login
 * @description - User Login
 */
router.post("/login", validators.loginValidator, usersController.login);

/**
 * @method - POST
 * @param - /api/signup
 * @description - User Signup
 */
router.post("/signup", validators.signupValidator, usersController.signup);

/**
 * @method - POST
 * @param - /api/logout
 * @description - Logout
 */
router.post("/logout", requireAuthentication, usersController.logout);

/**
 * @method - POST
 * @param - /api/master-logout
 * @description - Logout from all devices
 */
router.post(
  "/master-logout",
  requireAuthentication,
  usersController.logoutAllDevices
);

/**
 * @method - POST
 * @param - /api/reauth
 * @description - Regenerate Access Token
 */
router.post("/reauth", usersController.refreshAccessToken);

/**
 * @method - POST
 * @param - /api/forgotpass
 * @description - Send password reset email link
 */
router.post(
  "/forgotpass",
  validators.forgotPasswordValidator,
  usersController.forgotPassword
);

/**
 * @method - POST
 * @param - /api/resetpass
 * @description - Reset password
 */
router.patch(
  "/resetpass/:resetToken",
  validators.resetPasswordValidator,
  usersController.resetPassword
);

/**
 * @method - GET
 * @param - /api/users/me
 * @description - Get authenticated user
 */
router.get("/me", requireAuthentication, usersController.fetchAuthUserProfile);

/**
 * @method - GET
 * @param - /api/users/:id
 * @description - Get user by ID
 */
router.get(
  "/:id",
  requireAuthentication,
  validators.fetchUserProfileValidator,
  usersController.fetchUserProfile
);

module.exports = router;
