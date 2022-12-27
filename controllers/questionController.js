const Question = require("./../models/questionModel");
// const AppError = require('./../utils/globalErrorHandler');


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
      return res.status(404).json({
        status: "fail",
        message: "Question not found"
      })
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
    return res.status(404).json({
      status: "fail",
      message: "You cannot edit as you're not the creator",
    });
  }

  const question = await Question.findByIdAndUpdate(id, questionUpdate, {
    new: true,
    runValidators: true,
    context: "query",
  });

  if (!question) {
    return res.status(404).json({
      status: "fail",
      message: "Question not found",
    });
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
    const oldBlog = await Question.findById(id);

    // Checking if the user attempting to delete is the author 
    // if (req.user._id.toString() !== oldBlog.authorId._id.toString()) {
    //   return res.status(404).json({
    //     status: "fail",
    //     message: "You cannot delete as you're not the author",
    //   });
    //   // console.log(req.user._id.toString(), oldBlog.authorId._id.toString());
    // }
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
