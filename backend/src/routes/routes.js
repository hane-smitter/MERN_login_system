const express = require("express");

const { login, signup, refreshAccessToken } = require("../controllers/auth");
const validators = require("../validator/form-validator");

const router = express.Router();

router.get("/test", function (req, res) {
  res.send("Hello its working!!");
});

/**
 * @method - POST
 * @param - /login
 * @description - User Login
 */
router.post("/login", validators.loginValidator, login);

/**
 * @method - POST
 * @param - /signup
 * @description - User Signup
 */
router.post("/signup", validators.signupValidator, signup);

/**
 * @method - GET
 * @param - /reauth
 * @description - Regenerate Access Token
 */
router.get("/reauth", refreshAccessToken);

module.exports = router;
