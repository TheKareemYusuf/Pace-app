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
      return res.status(404).json({
        status: "fail",
        message: "Creator not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: creator,
    });
  } catch (error) {
    next(error);
  }
};

// const addSubjectByCreator =  async (req, res, next) => {
//   try {
//       const id = req.params.id;

//       const creator = await Creator.findByIdAndUpdate(
//         id,

//       );

//       if (!creator) {
//         return res.status(404).json({
//           status: "fail",
//           message: "Creator not found",
//         });
//       }

//       res.status(200).json({
//         status: "success",
//         data: creator,
//       });
//   } catch (error) {
//     next(error)
//   }
// };

const addSubjectByCreator = async (req, res, next) => {
  try {
    const id = req.params.id;
    const subjectsToAdd =  req.body.creatorSubjectOfInterest; // Assuming you pass an array of subjects in the request body
    
    const creator = await Creator.findById(id);

    if (!creator) {
      // change the respone to new app error
      return res.status(404).json({
        status: "fail",
        message: "Creator not found",
      });
    }

    // const currentSubjects = creator.creatorSubjectOfInterest || []; // If the field is not set yet, default to an empty array
    // const remainingSlots = 4 - currentSubjects.length;

    const currentSubjects = creator.creatorSubjectOfInterest
    console.log(currentSubjects);

    if (subjectsToAdd.length > 4) {
      // return res.status(400).json({
      //   status: "fail",
      //   message: `You can only add at most 4 subjects at a time`,
      // });
      return new AppError("You can only add at most 4 subjects at a time", 400)
    }

    // Assuming you want to prevent duplicates, you can check if the subject is already present in the array
    const uniqueSubjectsToAdd = subjectsToAdd.filter(
      (subject) => !currentSubjects.includes(subject)
    );

    const updatedSubjects = currentSubjects.concat(uniqueSubjectsToAdd);

    console.log(updatedSubjects);

    // creator.creatorSubjectOfInterest = updatedSubjects;
    // await creator.save();

    const addedSubjects = await Creator.findByIdAndUpdate(
      id,
      { creatorSubjectOfInterest: updatedSubjects },
      { new: true, runValidators: true, context: "query" }
    );

    res.status(200).json({
      status: "success",
      data: addedSubjects
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

    // Checking if the user attempting to delete is the author
    // if (req.user._id.toString() !== oldQuestion.creatorId._id.toString()) {
    //   return next(
    //     new AppError("You cannot delete as you're not the author", 403)
    //   );
    // }

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
  createCreator,
  updateCreatorStatus,
  addSubjectByCreator,
  deleteCreator,
};
