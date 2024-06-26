const User = require("./../models/userModel");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");


const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const getAllUsers = async (req, res, next) => {
  try {
    const features = new APIFeatures(User.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const users = await features.query;

    res.status(200).json({
      status: "success",
      result: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

const createUser = (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: "creator created successfully",
  });
};


const updateProfileByUser = async (req, res, next) => {
  try {
    const id = req.user._id;
    let userUpdate = { ...req.body };
    // if (userUpdate.state) delete userUpdate.state;

    const oldUser = await User.findById(id);


    if (!oldUser) {
      return next(
        new AppError("User not found", 404)
      );
    }

    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          "This route is not for password updates. Please use /updateMyPassword.",
          400
        )
      );
    } 

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(userUpdate, "firstName", "lastName", "subjectOfInterest", "gender", "email", "phoneNumber", "username", "dateOfBirth", "department", "levelOfStudy" )

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(id, filteredBody, {
      new: true,
      runValidators: true,
      context: "query"
    });

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const id = req.params.id;
    let userUpdate = { ...req.body };
    // if (userUpdate.state) delete userUpdate.state;

    const oldUser = await User.findById(id);


    if (!oldUser) {
      return next(
        new AppError("User not found", 404)
      );
    }

    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          "This route is not for password updates. Please use /updateMyPassword.",
          400
        )
      );
    } 

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(userUpdate, "firstName", "lastName", "subjectOfInterest", "gender", "email", "phoneNumber", "username", "dateOfBirth", "department", "levelOfStudy" )

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(id, filteredBody, {
      new: true,
      runValidators: true,
      context: "query"
    });

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

const checkEmailAvailability = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new AppError("Email is required", 400));
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(200).json({
        status: "success",
        message: "email already exists",
      })
    } else {
      res.status(200).json({
        status: "success",
        message: "email available",
      });
    }

    
  } catch (error) {
    next(error);
  }
};


const updateUserStatus = async (req, res, next) => {
  try {
    let status = req.body.status;
    const id = req.params.id;

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

    const user = await User.findByIdAndUpdate(
      id,
      { status: status.toLowerCase() },
      { new: true, runValidators: true, context: "query" }
    );

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const oldUser = await User.findById(id);

    if (!oldUser) {
      return next(new AppError("User not found", 404));
    }

    await User.findByIdAndRemove(id);

    res.status(200).json({
      status: "user successfully deleted",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUserStatus,
  updateProfileByUser,
  updateUserProfile,
  deleteUser,
  checkEmailAvailability,
};
