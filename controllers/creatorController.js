const mongoose = require("mongoose");
const Creator = require("./../models/creatorModel");
const Question = require("./../models/questionModel");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");
const uploadPicture = require("./../utils/multerImageHandler");
const {
  uploadToCloudinary,
  removeFromCloudinary,
} = require("./../utils/cloudinary");

const uploadCreatorPicture = uploadPicture.single("creatorProfileImage");

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

// In progress
const uploadCreatorProfilePicture = async (req, res, next) => {
  try {
    // Get the user id
    const id = req.user._id;
    const creator = await Creator.findById(id);

    // check to see if creator truly exists
    if (!creator) {
      return next(new AppError("Creator not found", 404));
    }

    // Remove the previously uploaded image from clodinary
    const public_id = creator.creatorImagePublicId
    if (public_id && (public_id !== "question-images/asp0ztuvtucupf3lcwpl")) {
      await removeFromCloudinary(public_id);
    }

    // initialize image data
    let imageData = {};

    // uploads the image to cloudinary if there's any
    if (req.file) {
      const imageBuffer = req.file.buffer;
      const data = await uploadToCloudinary(imageBuffer, "creator-images");
      imageData = data;
    }

    console.log(imageData);

    // update the database with the recently uploaded image
    const profileImage = await Creator.findByIdAndUpdate(
      id,
      {
        creatorImageUrl: imageData.url,
        creatorImagePublicId: imageData.public_id,
      },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    res.status(200).json({
      status: "success",
      message: "Profile picture uploaded successfully",
      data: {
        creatorImageUrl: imageData.url,
        creatorImagePublicId: imageData.public_id,
      },
    });
  } catch (error) {
    next(error);
  }
};
// const getProfile = async (req, res, next) => {
//   try {
//     const id = req.user._id;
//     const creator = await Creator.findById(id);

//     // console.log(id);

//     if (!creator) {
//       return next(new AppError("Creator not found", 404));
//     }

//     const creatorProfileStats = await Question.aggregate([
//       { $match: { creatorId: new mongoose.Types.ObjectId(id) } },
//       {
//         $facet: {
//           totalQuestions: [
//             {
//               $count: "count",
//             },
//           ],
//           statsByState: [
//             {
//               $group: {
//                 _id: "$state",
//                 count: { $sum: 1 },
//               },
//             },
//           ],
//         },
//       },
//       {
//         $project: {
//           totalQuestions: { $arrayElemAt: ["$totalQuestions.count", 0] },
//           statsByState: 1,
//         },
//       },
//     ]);

//     // numberOfPending = creatorProfileStats[0]._id
//     res.status(200).json({
//       status: "success",
//       data: {
//         // creatorDetails: {
//         //   firstName: creator.firstName || null,
//         //   lastName: creator.lastName || null,
//         //   email: creator.email,
//         //   phoneNumber: creator.phoneNumber || null,
//         // },
//         creator,
//         totalQuestions: creatorProfileStats[1],
//         statsByState: creatorProfileStats[0]
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const getProfile = async (req, res, next) => {
  try {
    const id = req.user._id;
    const creator = await Creator.findById(id);

    if (!creator) {
      return next(new AppError("Creator not found", 404));
    }

    const creatorProfileStats = await Question.aggregate([
      { $match: { creatorId: new mongoose.Types.ObjectId(id) } },
      {
        $facet: {
          totalQuestions: [
            {
              $count: "count",
            },
          ],
          statsByState: [
            {
              $group: {
                _id: "$state",
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
      {
        $project: {
          totalQuestions: { $arrayElemAt: ["$totalQuestions.count", 0] },
          statsByState: 1,
        },
      },
    ]);

    // Transform the array of statsByState into an object
    const statsByStateObj = {};
    creatorProfileStats[0].statsByState.forEach((stat) => {
      statsByStateObj[stat._id] = stat.count;
    });

    // Ensure that all states (pending, approved, rejected) are present in the response
    const stateLabels = ["pending", "approved", "rejected"];
    stateLabels.forEach((state) => {
      if (!statsByStateObj.hasOwnProperty(state)) {
        statsByStateObj[state] = 0;
      }
    });

    res.status(200).json({
      status: "success",
      data: {
        creator,
        totalQuestions: creatorProfileStats[0].totalQuestions,
        statsByState: statsByStateObj,
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
  uploadCreatorPicture,
  uploadCreatorProfilePicture,
  createCreator,
  updateCreatorStatus,
  addSubjectByCreator,
  deleteCreator,
};
