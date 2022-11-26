const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("node:crypto");

const CustomError = require("../config/error/customErrorConstructor");

// ENV Vars
const ACCESS_TOKEN = {
  secret: process.env.AUTH_ACCESS_TOKEN_SECRET,
  expiry: process.env.AUTH_ACCESS_TOKEN_EXPIRY,
};
const REFRESH_TOKEN = {
  secret: process.env.AUTH_REFRESH_TOKEN_SECRET,
  expiry: process.env.AUTH_REFRESH_TOKEN_EXPIRY,
};
const RESET_PASSWORD_TOKEN = {
  secret: process.env.RESET_PASSWORD_TOKEN_SECRET,
  expiry: process.env.RESET_PASSWORD_TOKEN_EXPIRY_MINS,
};

const User = mongoose.Schema;

const UserSchema = new User({
  firstName: { type: String, required: [true, "First name is required"] },
  lastName: { type: String, required: [true, "Last name is required"] },
  email: { type: String, required: [true, "Email is required"], unique: true },
  password: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: { required: true, type: String },
    },
  ],
  resetpasswordtoken: String,
  resetpasswordtokenexpiry: Date,
});
UserSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret, options) {
    // remove the property(s) of every document before returning the result
    delete ret.password;
    delete ret.tokens;
    return ret;
  },
});

UserSchema.pre("save", async function (next) {
  try {
    // Only hash Password if it has been Modified
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    // If you call `next()` with an argument, that argument is assumed to be
    // an error
    next(error);
  }
});

UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await UserModel.findOne({ email });
  if (!user)
    throw new CustomError("Wrong credentials!", 401, "Wrong credentials!");
  const passwdMatch = await bcrypt.compare(password, user.password);
  if (!passwdMatch)
    throw new CustomError("Wrong credentials!!", 401, "Wrong credentials!!");
  return user;
};
// Generates Access token and saves it in the DB before returning it
UserSchema.methods.generateAcessToken = async function () {
  const accessToken = jwt.sign(
    {
      _id: this._id.toString(),
      fullName: `${this.firstName} ${this.lastName}`,
      email: this.email,
    },
    ACCESS_TOKEN.secret,
    {
      expiresIn: ACCESS_TOKEN.expiry,
    }
  );
  this.tokens.push({ token: accessToken });
  await this.save();

  return accessToken;
};

UserSchema.methods.generateRefreshToken = function () {
  const refreshToken = jwt.sign(
    {
      _id: this._id.toString(),
    },
    REFRESH_TOKEN.secret,
    {
      expiresIn: REFRESH_TOKEN.expiry,
    }
  );

  return refreshToken;
};

UserSchema.methods.generateResetToken = async function () {
/* 
Again to reiterate hashes aren't designed to be decrypted.
However once you have a hash you can check any string is equal
to that hash by putting it through the same encryption with the same secret.
*/

// Read about base64url: [https://www.rfc-editor.org/rfc/rfc4648#section-5]

  const resetTokenValue = crypto.randomBytes(40).toString("base64url");

  const resetTokenSecret = crypto.randomBytes(15).toString("hex");

  const resetToken = `${resetTokenValue}+${resetTokenSecret}`; // Separator of `+` since base64url doesnt include this character

  // 1. Create Hash of the resetTokenValue with a secret(`resetTokenSecret`)
  const resetTokenHash = crypto
    .createHmac("sha256", resetTokenSecret)
    .update(resetTokenValue)
    .digest("hex");

  // 2. Create DB entry
  this.resetpasswordtoken = resetTokenHash;
  this.resetpasswordtokenexpiry =
    Date.now() + (RESET_PASSWORD_TOKEN.expiry || 5) * 60 * 1000;

  // 3. Save
  await this.save();

  // 4. Return the reset token(unencrypted)
  return resetToken;
};

// Compile model from schema
const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
