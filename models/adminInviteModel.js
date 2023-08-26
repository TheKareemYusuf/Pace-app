const crypto = require("crypto");
const mongoose = require("mongoose");

const InviteSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true 
},
  token: {
    type: String,
    default: () => crypto.randomBytes(40).toString("hex"),
    required: true,
  },
  expiry: {
    type: Date,
    default: () => Date.now() + 10 * 60 * 1000,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Creator",
  },
});

InviteSchema.methods.isExpired = function () {
  return Date.now() > this.expiry || this.user;
};

// Create a TTL index on the "expiry" field with a 0-second expiration delay
// InviteSchema.index({ expiry: 1 }, { expireAfterSeconds: 0 })

const Invite = mongoose.model("Invite", InviteSchema);

module.exports = Invite;
