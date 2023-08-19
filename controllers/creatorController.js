const Creator = require("./../models/creatorModel");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");

const getAllCreators = async (req, res, next) => {
  // res.status(200).json({
  //   status: "success",
  //   data: "display all creators here",
  // });
  try {
    // const id = req.user._id;

    const features = new APIFeatures(Creator.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const creators = await features.query;

    res.status(200).json({
      status: "success",
      result: creators.length,
      data: {
        creators,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCreator = async (req, res, next) => {
  try {
    const id = req.params.id;
    const creator = await Creator.findById(id);

    if (!creator) {
      return next(new AppError("Creator not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        creator,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const id = req.user._id;
    const creator = await Creator.findById(id);

    console.log(id);

    if (!creator) {
      return next(new AppError("Creator not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        creator,
      },
    });
  } catch (error) {
    next(error);
  }
};

const createCreator = (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: "creator created successfully",
  });
};

const updateCreatorStatus = async (req, res, next) => {
  try {
    let status = req.body.status;
    const id = req.params.id;

    if (req.user.role !== "admin") {
      return new AppError("You are not authorized", 403);
    }

    if (
      !(
        status &&
        (status.toLowerCase() === "active" ||
          status.toLowerCase() === "non-active" ||
          status.toLowerCase() === "deactivated")
      )
    ) {
      return next(new AppError("Please provide a valid status"));
    }

    const creator = await Creator.findByIdAndUpdate(
      id,
      { status: status.toLowerCase() },
      { new: true, runValidators: true, context: "query" }
    );

    if (!creator) {
      return next(new AppError("creator not found!", 404));
    }

    res.status(200).json({
      status: "success",
      data: creator,
    });
  } catch (error) {
    next(error);
  }
};

const addSubjectByCreator = async (req, res, next) => {
  try {
    const id = req.params.id;

    // Expecting an array of subjects in the request body
    const subjectsToAdd = req.body.creatorSubjectOfInterest;
    const creator = await Creator.findById(id);

    if (!creator) {
      return next(new AppError("creator not found!", 404));
    }

    // const currentSubjects = creator.creatorSubjectOfInterest

    if (subjectsToAdd.length > 4) {
      return next(new AppError("You can only add at most 4 subjects", 400));
    }

    // Prevent duplicates by checking if the subject is already present in the array
    uniqueSubjectsToAdd = subjectsToAdd.filter(
      (subject, i, a) => a.indexOf(subject) === i
    );


    const addedSubjects = await Creator.findByIdAndUpdate(
      id,
      { creatorSubjectOfInterest: uniqueSubjectsToAdd },
      { new: true, runValidators: true, context: "query" }
    );

    res.status(200).json({
      status: "success",
      data: addedSubjects,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCreator = async (req, res, next) => {
  try {
    const id = req.params.id;
    const oldCreator = await Creator.findById(id);

    if (!oldCreator) {
      return next(new AppError("Creator not found", 404));
    }

    await Creator.findByIdAndRemove(id);

    res.status(200).json({
      status: "creator successfully deleted",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCreators,
  getCreator,
  getProfile,
  createCreator,
  updateCreatorStatus,
  addSubjectByCreator,
  deleteCreator,
};
