const authValidators = require("./auth-validators");
const userValidators = require("./user-validators");

module.exports = {
  ...authValidators,
  ...userValidators,
};
