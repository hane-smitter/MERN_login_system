const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const CustomError = require("../config/errors/CustomError");

// Pull in Environment variables
const ACCESS_TOKEN = {
  secret: process.env.AUTH_ACCESS_TOKEN_SECRET,
  expiry: process.env.AUTH_ACCESS_TOKEN_EXPIRY,
};
const REFRESH_TOKEN = {
  secret: process.env.AUTH_REFRESH_TOKEN_SECRET,
  expiry: process.env.AUTH_REFRESH_TOKEN_EXPIRY,
};
const RESET_PASSWORD_TOKEN = {
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
    delete ret.password;
    delete ret.tokens;
    return ret;
  },
});

UserSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await UserModel.findOne({ email });
  if (!user)
    throw new CustomError("Wrong credentials!", 400, "Email or password is wrong!");
  const passwdMatch = await bcrypt.compare(password, user.password);
  if (!passwdMatch)
    throw new CustomError("Wrong credentials!!", 400, "Email or password is wrong!");
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
  const resetTokenValue = crypto.randomBytes(20).toString("base64url");
  const resetTokenSecret = crypto.randomBytes(10).toString("hex");

   // Separator of `+` because generated base64url characters doesnt include this character
  const resetToken = `${resetTokenValue}+${resetTokenSecret}`;

  const resetTokenHash = crypto
    .createHmac("sha256", resetTokenSecret)
    .update(resetTokenValue)
    .digest("hex");

  this.resetpasswordtoken = resetTokenHash;
  this.resetpasswordtokenexpiry =
    Date.now() + (RESET_PASSWORD_TOKEN.expiry || 5) * 60 * 1000;

  await this.save();

  return resetToken;
};

// Compile model from schema
const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
