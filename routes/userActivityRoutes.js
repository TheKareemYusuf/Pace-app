const express = require("express");
const passport = require("passport");
const userController = require("./../controllers/userController");
const UserValidationMW = require("./../validators/user.validation");
// const restrictToMW = require("./../authentication/restrictionHandler");

const router = express.Router();

router.patch(
  "/update-proflie/:id",
  UserValidationMW,
  passport.authenticate("jwt", { session: false }),
  userController.updateUserProfile
);
// router.delete("/deleteMe");

module.exports = router;
