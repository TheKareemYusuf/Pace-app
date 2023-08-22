// const { string } = require("joi");
const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is compulsory"],
      unique: true,
      trim: true,
    },
    questionImageUrl: String,
    questionImagePublicId: String,
    answerOptions: {
      type: [
        { 
          type: String,
          required: true,
        },
      ],
      default: [],
    },
    correctAnswer: {
      type: String,
      required: true,
    },
    // correctAnswer: {
    //   type: Number,
    //   required: true,
    //   validate: {
    //     validator: function (value) {
    //       return value >= 0 && value < this.answerOptions.length;
    //     },
    //     message: "Correct answer index is invalid",
    //   },
    // },
    subject: {
      type: String,
      required: [true, "Question must be set under a question"],
      trim: true,
    },
    // subjectId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   // get the Subject from SubjectSchema
    //   ref: "Subject",
    // },
    creatorName: {
      type: String,
      // get the creator from creatorSchema
      ref: "Creator",
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // get the creator from creatorSchema
      ref: "Creator",
    },
    state: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
    },
    mode: {
      type: String,
      default: "practice",
      enum: ["practice", "live"],
    },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", QuestionSchema);

module.exports = Question;
