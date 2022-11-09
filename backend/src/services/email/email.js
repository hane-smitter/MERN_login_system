"use strict";
const nodemailer = require("nodemailer");

const emailUserName = process.env.AUTH_EMAIL_USERNAME;
const emailUserPassword = process.env.AUTH_EMAIL_PASSWORD;

async function main(mailOptions) {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: emailUserName,
      pass: emailUserPassword,
    },
  });

  // Send mail with defined transport object
  const info = await transporter.sendMail({
    from: mailOptions?.from, // sender address
    to: mailOptions?.to, // list of receivers
    subject: mailOptions?.subject, // Subject line
    text: mailOptions?.text, // plain text body
    html: mailOptions?.html, // html body
  });

  // console.log("Message sent: %s", info.messageId);

  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  return info;
}

module.exports = main;
