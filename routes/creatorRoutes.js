const express = require("express");
const passport = require("passport");
const creatorController = require("./../controllers/creatorController");
const CreatorValidationMW = require("./../validators/creator.validation");

const router = express.Router();

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
    creatorController.updateCreator
  )
  .delete(
    passport.authenticate("jwt", { session: false }),
    creatorController.deleteCreator
  );

module.exports = router;