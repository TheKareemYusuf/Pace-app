const express = require("express");
const passport = require("passport");
const creatorController = require("./../controllers/creatorController");
const CreatorValidationMW = require("./../validators/creator.validation");
const restrictToMW = require("./../authentication/restrictionHandler");

const router = express.Router();

// router.route("/invite").post(inviteController.generateInviteLink);
// router
//   .route("/invite/verify/:token")
//   .get(inviteController.getInvitationLinkPage)
//   .post(inviteController.verifyInviteLink);

router
  .route("/")
  .get(
    passport.authenticate("jwt", { session: false }),
    creatorController.getAllCreators
  )
  .post(
    CreatorValidationMW,
    passport.authenticate("jwt", { session: false }),
    creatorController.createCreator
  );

router
  .route("/:id")
  .get(
    passport.authenticate("jwt", { session: false }),
    creatorController.getCreator
  )
  .put(
    passport.authenticate("jwt", { session: false }),
    // restrictToMW.restrictTo('admin'),
    creatorController.updateCreator
  )
  .delete(
    passport.authenticate("jwt", { session: false }),
    // restrictToMW.restrictTo('admin'),
    creatorController.deleteCreator
  );

module.exports = router;
