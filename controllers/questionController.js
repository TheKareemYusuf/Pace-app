const Question = require("./../models/questionModel");
const AppError = require("../utils/appError");
const APIFeatures = require('./../utils/apiFeatures');
const Creator = require("./../models/creatorModel");

// Get all questions
const getAllQuestions = async (req, res, next) => {
  try {
    // grab the id of the person hitting the route from req.body
    const id = req.user._id;
    // use the id to query the database to get role
    const user = await Creator.findById(id);

    // console.log(user.role);
    if (user.role === "creator") {
      // const questions = await Question.find().where("creatorId").equals(id);

       const features = new APIFeatures(Question.find().where("creatorId").equals(id), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

      const questions = await features.query

      res.status(200).json({
        status: "success",
        result: questions.length,
        data: {
          questions,
        },
      });
    } else {

      const features = new APIFeatures(Question.find(), req.query)
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
    }
  } catch (error) {
    next(error);
  }
};

// Get single question
const getQuestion = async (req, res, next) => {
  try {
    const id = req.params.id;
    const question = await Question.findById(id);

    if (!question) {
      return next(new AppError("Question with the ID not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        question,
      },
    });
  } catch (error) {
    next(error.message);
  }
};

const createQuestion = async (req, res, next) => {
  try {
    const {
      question,
      answerOptions,
      subject,
      correctAnswer,
      questionImageUrl,
      mode,
    } = req.body;
    const newQuestion = await Question.create({
      question,
      questionImageUrl,
      answerOptions,
      subject,
      correctAnswer,
      creatorName: req.user.firstName,
      creatorId: req.user._id,
      mode,
    });

    res.status(201).json({
      status: "success",
      message: "Question created successfully",
      data: newQuestion,
    });
  } catch (error) {
    next(error);
  }
};

// This role will be reserved for super admin
const updateQuestionState = async (req, res, next) => {
  try {
    let  state  = req.body.state;
    const id = req.params.id;

    const oldQuestion = await Question.findById(id);

    // Checking if the user attempting to update is the author 
    if (req.user._id.toString() !== oldQuestion.creatorId._id.toString()) {
      return next(
        new AppError("You cannot edit as you're not the author", 403)
      );
    } 

    if (
      !(
        state &&
        (state.toLowerCase() === "pending" || state.toLowerCase() === "approved" || state.toLowerCase() === "rejected")
      )
    ) {
      throw new Error("Please provide a valid state");
    }

    const question = await Question.findByIdAndUpdate(
      id,
      { state: state.toLowerCase() },
      { new: true, runValidators: true, context: "query" }
    );

    if (!question) {
      return res.status(404).json({
        status: "fail",
        message: "Question not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

const updateQuestion = async (req, res, next) => {
  try {
    let questionUpdate = { ...req.body };
    const id = req.params.id;

    if (questionUpdate.state) delete questionUpdate.state;

    const oldQuestion = await Question.findById(id);

    if (req.user._id.toString() !== oldQuestion.creatorId._id.toString()) {
      return next(
        new AppError("You cannot edit as you're not the author", 403)
      );
    }

    const question = await Question.findByIdAndUpdate(id, questionUpdate, {
      new: true,
      runValidators: true,
      context: "query",
    });

    if (!question) {
      return next(new AppError("Question not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Question updated successfully",
      data: questionUpdate,
    });
  } catch (error) {
    next(error);
  }
};

const deleteQuestion = async (req, res, next) => {
  try {
    const id = req.params.id;
    const oldQuestion = await Question.findById(id);

    if (!oldQuestion) {
      return next(new AppError("Question not found", 404));
    }

    // Checking if the user attempting to delete is the author
    // if (req.user._id.toString() !== oldQuestion.creatorId._id.toString()) {
    //   return next(
    //     new AppError("You cannot delete as you're not the author", 403)
    //   );
    // }
    

    await Question.findByIdAndRemove(id);

    res.status(200).json({
      status: "question successfully deleted",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  updateQuestionState,
  deleteQuestion,
};
