const express = require("express");
const passport = require("passport");
const questionController = require("./../controllers/questionController");
const QuestionValidationMW = require("./../validators/question.validator");
const restrictToMW = require("./../authentication/restrictionHandler");

const router = express.Router();

router
  .route("/")
  .get(
    passport.authenticate("jwt", { session: false }),
    questionController.getAllQuestions
  )
  .post(
    passport.authenticate("jwt", { session: false }),
    // QuestionValidationMW,
    questionController.uploadQuestionPicture,
    questionController.resizeQuestionPicture,
    questionController.createQuestion
  );

router
  .route("/:id")
  .get(
    passport.authenticate("jwt", { session: false }),
    questionController.getQuestion
  )
  .put(
    passport.authenticate("jwt", { session: false }),
    // restrictToMW.restrictTo('admin'),
    questionController.updateQuestion
  )
  .patch(
    passport.authenticate("jwt", { session: false }),
    restrictToMW.restrictTo("admin"),
    questionController.updateQuestionState
  )
  .delete(
    passport.authenticate("jwt", { session: false }),
    restrictToMW.restrictTo("admin"),
    questionController.deleteQuestion
  );

module.exports = router;
