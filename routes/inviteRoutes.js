const express = require("express");
const inviteController = require("./../controllers/inviteController");

const router = express.Router();

router.route("/").post(inviteController.generateInviteLink);
router
  .route("/verify/:token")
  .get(inviteController.getInvitationLinkPage)
  .post(inviteController.verifyInviteLink);

module.exports = router;
