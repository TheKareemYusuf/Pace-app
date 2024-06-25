const express = require("express");
const passport = require("passport");
const notificationController = require("./../controllers/notificationController");


const router = express.Router();

router
  .route("/")
  .get(
    passport.authenticate("jwt", { session: false }),
    notificationController.getNotifications
  )
//   .post(
//     passport.authenticate("jwt", { session: false }),
//     restrictToMW.restrictTo('admin'),
//     // SubjectValidationMW,
//     subjectController.createSubject
//   );

// router
//   .route("/:id")
//   .get(
//     passport.authenticate("jwt", { session: false }),
//     subjectController.getSubject
//   )
//   .put(
//     passport.authenticate("jwt", { session: false }),
//     restrictToMW.restrictTo('admin'),
//     subjectController.updateSubject
//   )
//   .delete(
//     passport.authenticate("jwt", { session: false }),
//     restrictToMW.restrictTo("admin"),
//     subjectController.deleteSubject
//   );

module.exports = router;
