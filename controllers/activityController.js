const Question = require("./../models/questionModel");
const AppError = require("../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");
const User = require("./../models/userModel");

// Get all questions
const getAllQuestions = async (req, res, next) => {
  try {
    // grab the id of the person hitting the route from req.body
    const id = req.user._id;
    // use the id to query the database to get role
    const user = await User.findById(id);

    // console.log(user.role);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const features = new APIFeatures(
      Question.find()
        .where("mode")
        .equals("practice")
        .where("state")
        .equals("approved"),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const questions = await features.query;

    res.status(200).json({
      status: "success",
      result: questions.length,
      data: {
        questions,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllQuestions,
};
