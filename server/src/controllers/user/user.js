const { validationResult } = require("express-validator");
const CustomError = require("../../config/error/customErrorConstructor");
const User = require("../../models/User");

/* FETCH USER PROFILE */
module.exports.fetchUserProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError(errors.array(), 422, errors.array()[0]?.msg);
    }

    const userId = req.params.id;

    const retrievedUser = await User.findById(userId);

    res.json({
      success: true,
      user: retrievedUser,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
