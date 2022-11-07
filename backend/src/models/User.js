const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const CustomError = require("../errors/customErrorConstructor");

// ENV Vars
const aTknSecret = process.env.AUTH_ACCESS_TOKEN_SECRET;
const aTknExpiry = process.env.AUTH_ACCESS_TOKEN_EXPIRY;
const rTknSecret = process.env.AUTH_REFRESH_TOKEN_SECRET;
const rTknExpiry = process.env.AUTH_REFRESH_TOKEN_EXPIRY;

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
  if (!user) throw new CustomError("Wrong credentials!", 401);
  const passwdMatch = await bcrypt.compare(password, user.password);
  if (!passwdMatch) throw new ErrorResponse("Wrong credentials!!", 401);
  return user;
};

UserSchema.methods.generateAcessToken = async function () {
  const accessToken = jwt.sign(
    {
      _id: this._id,
      fullName: `${this.firstName} ${this.lastName}`,
      email: this.email,
    },
    aTknSecret,
    {
      expiresIn: aTknExpiry,
    }
  );
  this.tokens = this.tokens.push({ token });
  await this.save();

  return accessToken;
};

UserSchema.methods.generateRefreshToken = function () {
  const refreshToken = jwt.sign(
    {
      _id: this._id.toString(),
    },
    rTknSecret,
    {
      expiresIn: rTknExpiry,
    }
  );

  return refreshToken;
};

// Compile model from schema
const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
