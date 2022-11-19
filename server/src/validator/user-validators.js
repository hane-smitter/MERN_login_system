const { param } = require("express-validator");

module.exports.fetchUserProfileValidator = [
  param("id").notEmpty().withMessage("User id missing"),
];
