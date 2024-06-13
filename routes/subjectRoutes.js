const express = require("express");
const passport = require("passport");
const subjectController = require("./../controllers/subjectController");
const SubjectValidationMW = require("./../validators/subject.validator");
const restrictToMW = require("./../authentication/restrictionHandler");

const router = express.Router();

router
  .route("/")
  .get(
    passport.authenticate("jwt", { session: false }),
    subjectController.getAllSubjects
  )
  .post(
    passport.authenticate("jwt", { session: false }),
    restrictToMW.restrictTo('admin'),
    // SubjectValidationMW,
    subjectController.createSubject
  );

router
  .route("/:id")
  .get(
    passport.authenticate("jwt", { session: false }),
    subjectController.getSubject
  )
  .put(
    passport.authenticate("jwt", { session: false }),
    restrictToMW.restrictTo('admin'),
    subjectController.updateSubject
  )
  .delete(
    passport.authenticate("jwt", { session: false }),
    restrictToMW.restrictTo("admin"),
    subjectController.deleteSubject
  );

module.exports = router;
