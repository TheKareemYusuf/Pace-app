const Question = require("./../models/questionModel");
const AppError = require("../utils/appError");

const checkAnswer = async (req, res, next) => {
  try {
    const { questionId, answer } = req.body;

    const question = await Question.findById(questionId);

    if (!question) {
      return next(new AppError("Question not found", 404));
    }

    if (!question.answerOptions.includes(answer)) {
      return next(new AppError("Answer not found", 404));
    }

    const feedback = answer === question.correctAnswer ? "Correct! ✔" : "Wrong! ❌";

    res.status(200).json({
      status: "success",
      feedback,
      // data: {
      //   question,
      // },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkAnswer,
};
