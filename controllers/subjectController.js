const Subject = require("../models/subjectModel");
const AppError = require("../utils/appError");

// Get all subjects
const getAllSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json({
      status: "success",
      results: subjects.length,
      data: {
        subjects
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get a single subject by ID
const getSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return next(new AppError('No subject found with that ID', 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        subject
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create a new subject
const createSubject = async (req, res, next) => {
  try {
    // Validate the department field
    const { department, subject } = req.body;
    
    
    const validDepartments = ["social-sciences", 'sciences' ];
    if (!department || !validDepartments.includes(department.toLowerCase())) {
      return next(new AppError('Invalid or missing department', 400));
    }

    const newSubject = await Subject.create({department, subject});
    res.status(201).json({
      status: "success",
      data: {
        subject: newSubject
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update an existing subject
const updateSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!subject) {
      return next(new AppError('No subject found with that ID', 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        subject
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete a subject
const deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) {
      return next(new AppError('No subject found with that ID', 404));
    }
    res.status(204).json({
      status: "success",
      data: null
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject
};