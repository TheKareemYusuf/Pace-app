const Creator = require('./../models/creatorModel');



const getAllCreators = (req, res) => {
    res.status(200).json({
      status: "success",
      data: "display all creators here",
    });
  };
  
  const getCreator = (req, res) => {
    res.status(200).json({
      status: "success",
      data: "a single question",
    });
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
  