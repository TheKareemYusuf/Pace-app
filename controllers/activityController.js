const Question = require("./../models/questionModel");
const UserActivity = require("./../models/activityModel");
const AppError = require("../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");

 
const checkAnswer = async (req, res, next) => {
  try {
    const { questionId, answer } = req.body;
    const userId = req.user._id;

    const question = await Question.findById(questionId);

    if (!question) {
      return next(new AppError("Question not found", 404));
    }

    const subject = question.subject;

    if (!question.answerOptions.includes(answer)) {
      return next(new AppError("Answer not found", 404));
    }

    const isCorrect = answer === question.correctAnswer;
    const feedback = isCorrect ? "Correct! ✔" : "Wrong! ❌";

    // Save user ID, subject, and question ID to the Bucket model
    const bucket = await Bucket.findOneAndUpdate(
      { userId, subject },
      { $push: { questionsAnswered: questionId } },
      { new: true, upsert: true }
    );

    console.log(bucket);

    const userActivity = await UserActivity.findOneAndUpdate(
      { userId },
      {
        $push: { questionsAnswered: { questionId, correct: isCorrect } },
        $inc: { score: isCorrect ? 1 : 0 }  // Increment score only if the answer is correct
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      status: "success",
      feedback,
      data: {
        bucket,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getLeaderboard = async () => {
  try {

    // const features = new APIFeatures(
    //   Question.find().where("creatorId").equals(id),
    //   req.query
    // )
    //   .filter()
    //   .sort()
    //   .limitFields()
    //   .paginate();

    // const questions = await features.query;
    const leaderboard = await User.find({})
      .sort({ score: -1 }) // Sorting users by score in descending order
      .limit(10); // Limiting to top 10 users

    res.status(200).json({
      status: "success",
      data: {
        leaderboard
      }
    });
  } catch (error) {
    next(error)
  }
}

module.exports = {
  checkAnswer,
  getLeaderboard
};
