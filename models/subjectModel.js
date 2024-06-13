const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, "Subject name is required"],
    unique: true
  },
  department: {
    type: String,
    enum: ["social-sciences", "sciences", ]
  }
});

const Subject = mongoose.model("Subject", SubjectSchema);

module.exports = Subject;
