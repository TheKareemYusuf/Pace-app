const Question = require("./../models/questionModel");

const getAllQuestions = (req, res) => {
  res.status(200).json({
    status: "success",
    data: "display all questions here",
  });
};

const getQuestion = (req, res) => {
  res.status(200).json({
    status: "success",
    data: "a single question",
  });
};

const createQuestion = async (req, res, next) => {
  try {
    const { question, answers, subject, correctAnswer } = req.body;
    const newQuestion = await Question.create({
      question,
      answers,
      subject,
      correctAnswer,
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

const updateQuestion = (req, res) => {
  res.status(200).json({
    status: "success",
    data: "update a question",
  });
};

const deleteQuestion = (req, res) => {
  res.status(200).json({
    status: "success",
    data: "delete a queation",
  });
};

module.exports = {
  getAllQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
