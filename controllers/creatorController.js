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
    next(error)
  }
};

const getCreator = async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
};

const createCreator = (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: "creator created successfully",
  });
};

const updateCreator = (req, res) => {
  res.status(200).json({
    status: "success",
    data: "update a creator",
  });
};

const deleteCreator = (req, res) => {
  res.status(200).json({
    status: "success",
    data: "delete a creator",
  });
};

module.exports = {
  getAllCreators,
  getCreator,
  createCreator,
  updateCreator,
  deleteCreator,
};
