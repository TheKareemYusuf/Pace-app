const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is compulsory"],
      unique: true,
      trim: true,
    },
    questionImageUrl: [String],
    answers: {
        type: [{
          type: String,
          required: true
        }],
        default: []
      }, 
    correctAnswer: {
        type: String,
        required: true
    },
    subject: {
      type: String,
      required: [true, "Question must be set under a question"],
      trim: true,
    },
    creatorName: {
      type: String,
      //   get the creator from creatorSchema
      //   ref: "User",
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      //   required: true,
      //   get the creator from creatorSchema
      //   ref: "User",
    },
    state: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
    },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", QuestionSchema);

module.exports = Question;
