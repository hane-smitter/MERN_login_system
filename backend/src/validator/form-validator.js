const { body } = require("express-validator");

module.exports.loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email CANNOT be empty")
    .bail()
    .isEmail()
    .withMessage("Email is invalid"),
  body("password")
    .notEmpty()
    .withMessage("Password CANNOT be empty")
    .bail()
    .isLength({ min: 4 })
    .withMessage("Password MUST be at least 4 chars long"),
];
