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
    topic: {
      type: String,
      required: [true, "Question must be set under a topic"],
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

QuestionSchema.statics.getCreatorProfileStats = async function (creatorId) {
  const profileStats = await Question.aggregate([
    { $match: { creatorId: new mongoose.Types.ObjectId(creatorId) } },
    {
      $facet: {
        totalQuestions: [
          {
            $count: "count",
          },
        ],
        statsByState: [
          {
            $group: {
              _id: "$state",
              count: { $sum: 1 },
            },
          },
        ],
      },
    },
    {
      $project: {
        totalQuestions: { $arrayElemAt: ["$totalQuestions.count", 0] },
        statsByState: 1,
      },
    },
  ]);

  return profileStats;
};






QuestionSchema.statics.CreatorQuestionStats = async function (creatorId, subjectsOfInterest) {
    const questionStats = await Question.aggregate([
      // Match all questions that belong to the creator and the subjects of interest
      {
        $match: {
          creatorId: new mongoose.Types.ObjectId(creatorId),
          subject: { $in: subjectsOfInterest },
        },
      },
      // Group by subject and count questions
      {
        $group: {
          _id: "$subject",
          totalQuestionsByCreator: { $sum: 1 },
        },
      },
    ]);

  return questionStats;
};

QuestionSchema.statics.TotalCreatorQuestionStats = async function (subjectsOfInterest) {
   const totalQuestionsBySubject = await Question.aggregate([
      // Match questions with subjects of interest
      {
        $match: {
          subject: { $in: subjectsOfInterest },
        },
      },
      // Group by subject and count questions
      {
        $group: {
          _id: "$subject",
          totalQuestions: { $sum: 1 },
        },
      },
    ]);

    return totalQuestionsBySubject
}

const Question = mongoose.model("Question", QuestionSchema);

module.exports = Question;
