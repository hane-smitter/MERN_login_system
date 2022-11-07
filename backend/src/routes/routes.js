const express = require("express");

const { login } = require("../controllers/auth");
const validators = require("../validator/form-validator");

const router = express.Router();

router.get("/test", function (req, res) {
  res.send("Hello its working!!");
});

router.get("/login", validators.loginValidator, login);

module.exports = router;
