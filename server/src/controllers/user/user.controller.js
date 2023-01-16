const { validationResult } = require("express-validator");
const CustomError = require("../../config/errors/CustomError");
const User = require("../../models/User");

/* FETCH USER PROFILE BY ID */
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

/* FETCH PROFILE OF AUTHENTICATED USER */
module.exports.fetchAuthUserProfile = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
