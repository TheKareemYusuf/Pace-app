const Question = require("./../models/questionModel");
const AppError = require('../utils/appError');


// Get all questions
const getAllQuestions = async (req, res, next) => {
  try {

    const questions = await Question.find();


    res.status(200).json({
      status: "success",
      result: questions.length,
      data: {
        questions
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single question
const getQuestion = async (req, res, next) => {
  try {
    const id = req.params.id;
    const question = await Question.findById(id)

    if(!question) {
      return next(new AppError('Question with the ID not found', 404) )
    }

    res.status(200).json({
      status: "success",
      data: {
        question
      },
    });
  } catch (error) {
    next(error)
  }
};

const createQuestion = async (req, res, next) => {
  try {
    const { question, answers, subject, correctAnswer, questionImageUrl } = req.body;
    const newQuestion = await Question.create({
      question,
      answers,
      subject,
      correctAnswer,
      questionImageUrl,
      creatorName: req.user.firstName,
      creatorId: req.user._id,


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

const updateQuestion = async (req, res, next) => {
 try {

  let questionUpdate = { ...req.body }
  const id = req.params.id

  if (questionUpdate.state) delete questionUpdate.state

  const oldQuestion = await Question.findById(id)

  if (req.user._id.toString() !== oldQuestion.creatorId._id.toString()) {
    return next(new AppError("You cannot edit as you're not the author", 403))
  }

  const question = await Question.findByIdAndUpdate(id, questionUpdate, {
    new: true,
    runValidators: true,
    context: "query",
  });

  if(!question) {
    return next(new AppError('Question not found', 404) )
  }

  res.status(200).json({
    status: "success",
    message: "Question updated successfully",
    data: questionUpdate
  });
 } catch (error) {
  next(error)
 }
};

const deleteQuestion = async (req, res, next) => {
 try {
    const id = req.params.id;
    const oldQuestion = await Question.findById(id);

    if(!oldQuestion) {
      return next(new AppError('Question not found', 404) )
    }

    // Checking if the user attempting to delete is the author 
    if (req.user._id.toString() !== oldQuestion.creatorId._id.toString()) {
      return next(new AppError("You cannot delete as you're not the author", 403))
    }
    
    await Question.findByIdAndRemove(id);

  res.status(200).json({
    status: "question successfully deleted",
    data: null,
  });
 } catch (error) {
  next(error)
 }
};

module.exports = {
  getAllQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
