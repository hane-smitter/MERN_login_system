const { body, param } = require("express-validator");

const User = require("../models/User");

module.exports.loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email CANNOT be empty")
    .bail()
    .isEmail()
    .withMessage("Email is invalid"),
  body("password").notEmpty().withMessage("Password CANNOT be empty"),
];

module.exports.signupValidator = [
  body("firstName").trim().notEmpty().withMessage("Firstname CANNOT be empty"),
  body("lastName").trim().notEmpty().withMessage("Lastname CANNOT be empty"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email CANNOT be empty")
    .bail()
    .isEmail()
    .withMessage("Email is invalid")
    .bail()
    .custom(async (email) => {
      // Finding if email exists in Database
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        throw new Error("E-mail already in use");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("Password CANNOT be empty")
    .bail()
    .isLength({ min: 4 })
    .withMessage("Password MUST be at least 4 characters long"),
];

module.exports.forgotPasswordValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email CANNOT be empty")
    .bail()
    .isEmail()
    .withMessage("Email is invalid"),
];

module.exports.resetPasswordValidator = [
  param("resetToken").notEmpty().withMessage("Reset token missing"),
  body("password")
    .notEmpty()
    .withMessage("Password CANNOT be empty")
    .bail()
    .isLength({ min: 4 })
    .withMessage("Password MUST be at least 4 characters long"),
  body("passwordConfirm").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords DO NOT match");
    }

    return true;
  }),
];
