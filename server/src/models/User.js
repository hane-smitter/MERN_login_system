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

/* 
1. CREATE USER SCHEMA
 */
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

/* 
2. SET SCHEMA OPTION
 */
UserSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret, options) {
    const { firstName, lastName, email } = ret;

    return { firstName, lastName, email }; // return fields we need
  },
});

/* 
3. ATTACH MIDDLEWARE
 */
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

/* 
4. ATTACH CUSTOM STATIC METHODS
 */
UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await UserModel.findOne({ email });
  if (!user)
    throw new CustomError(
      "Wrong credentials!",
      400,
      "Email or password is wrong!"
    );
  const passwdMatch = await bcrypt.compare(password, user.password);
  if (!passwdMatch)
    throw new CustomError(
      "Wrong credentials!!",
      400,
      "Email or password is wrong!"
    );
  return user;
};

/* 
5. ATTACH CUSTOM INSTANCE METHODS
 */
UserSchema.methods.generateAcessToken = function () {
  const user = this;

  // Create signed access token
  const accessToken = jwt.sign(
    {
      _id: user._id.toString(),
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
    },
    ACCESS_TOKEN.secret,
    {
      expiresIn: ACCESS_TOKEN.expiry,
    }
  );

  return accessToken;
};

UserSchema.methods.generateRefreshToken = async function () {
  const user = this;

  // Create signed refresh token
  const refreshToken = jwt.sign(
    {
      _id: user._id.toString(),
    },
    REFRESH_TOKEN.secret,
    {
      expiresIn: REFRESH_TOKEN.expiry,
    }
  );

  // Create a access token hash
  const rTknHash = crypto
    .createHmac("sha256", REFRESH_TOKEN.secret)
    .update(refreshToken)
    .digest("hex");

  // Save to database
  user.tokens.push({ token: rTknHash });
  await user.save();

  return refreshToken;
};

UserSchema.methods.generateResetToken = async function () {
  const resetTokenValue = crypto.randomBytes(20).toString("base64url");
  const resetTokenSecret = crypto.randomBytes(10).toString("hex");
  const user = this;

  // Separator of `+` because generated base64url characters don't include this character
  const resetToken = `${resetTokenValue}+${resetTokenSecret}`;

  // Create a hash
  const resetTokenHash = crypto
    .createHmac("sha256", resetTokenSecret)
    .update(resetTokenValue)
    .digest("hex");

  user.resetpasswordtoken = resetTokenHash;
  user.resetpasswordtokenexpiry =
    Date.now() + (RESET_PASSWORD_TOKEN.expiry || 5) * 60 * 1000; // Sets expiration age

  await user.save();

  return resetToken;
};

/* 
6. COMPILE MODEL FROM SCHEMA
 */
const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
