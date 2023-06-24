const express = require("express");
const passport = require("passport");
const checkAnswerController = require("./../controllers/checkAnswerController");

const router = express.Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  checkAnswerController.checkAnswer
);

module.exports = router;
