const main = require("./email.js");

const fixedMailOptions = {
  from: process.env.EMAIL_FROM,
};

function sendEmail(options = {}) {
  const mailOptions = Object.assign({}, options, fixedMailOptions);
  return main(mailOptions);
}

module.exports.sendEmail = sendEmail;
