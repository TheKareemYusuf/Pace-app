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

// QuestionSchema.statics.CreatorQuestionStats = async function (creatorId) {
//   const questionStats = await Question.aggregate([{
//     $match: {
//       creatorId: new mongoose.Types.ObjectId(creatorId),
//     },
//   },
//   // Group by subject and count questions
//   {
//     $group: {
//       _id: "$subject",
//       totalQuestionsByCreator: { $sum: 1 },
//     },
//   },
//   // Lookup to get the total questions for each subject
//   {
//     $lookup: {
//       from: "questions", // Change this to the actual name of your questions collection
//       localField: "_id",
//       foreignField: "subject",
//       as: "subjectQuestions",
//     },
//   },
//   // Project fields and calculate the percentage
//   {
//     $project: {
//       _id: 0,
//       subject: "$_id",
//       totalQuestionsByCreator: 1,
//       totalQuestions: { $size: "$subjectQuestions" },
//       percentage: {
//         $cond: [
//           { $eq: [{ $size: "$subjectQuestions" }, 0] },
//           0,
//           {
//             $multiply: [
//               { $divide: ["$totalQuestionsByCreator", { $size: "$subjectQuestions" }] },
//               100,
//             ],
//           },
//         ],
//       },
//     },
//   }
// ]);

//   return questionStats;
// };

// QuestionSchema.statics.CreatorQuestionStats = async function (creatorId) {
//   const questionStats = await Question.aggregate([
//     {
//       $match: {
//         creatorId: mongoose.Types.ObjectId(creatorId),
//       },
//     },
//     // Group by subject and count questions
//     {
//       $group: {
//         _id: "$subject",
//         totalQuestionsByCreator: { $sum: 1 },
//       },
//     },
//     // Lookup to get the total questions for each subject
//     {
//       $lookup: {
//         from: "questions", // Change this to the actual name of your questions collection
//         localField: "_id",
//         foreignField: "subject",
//         as: "subjectQuestions",
//       },
//     },
//     // Project fields and calculate the percentage
//     {
//       $project: {
//         _id: 0,
//         subject: "$_id",
//         totalQuestionsByCreator: 1,
//         totalQuestions: { $size: "$subjectQuestions" },
//         percentage: {
//           $cond: [
//             { $eq: [{ $size: "$subjectQuestions" }, 0] },
//             0,
//             {
//               $multiply: [
//                 {
//                   $divide: [
//                     "$totalQuestionsByCreator",
//                     { $size: "$subjectQuestions" },
//                   ],
//                 },
//                 100,
//               ],
//             },
//           ],
//         },
//       },
//     },
//   ]);

//   return questionStats;
// };

QuestionSchema.statics.CreatorQuestionStats = async function (creatorId) {
  const sciences = ["mathematics", "english", "physics"];
  const nonSciences = [
    "Account",
    "Commerce",
    "Economics",
    "English",
    "Mathematics",
    "Government",
  ];

  const questionStats = await Question.aggregate([
    // Stage 1: Match questions with creators in their respective departments and subjects of interest
    {
      $match: {
        $or: [
          {
            subject: { $in: sciences },
            $or: [
              { department: "sciences" },
              { creatorSubjectOfInterest: { $in: sciences } },
            ],
          },
          {
            subject: { $in: nonSciences },
            $or: [
              { department: "non-Sciences" },
              { creatorSubjectOfInterest: { $in: nonSciences } },
            ],
          },
        ],
      },
    },
    // Stage 2: Group by subject and calculate total questions
    {
      $group: {
        _id: "$subject",
        totalQuestions: { $sum: 1 },
      },
    },
  ]);

  return questionStats;
};

const Question = mongoose.model("Question", QuestionSchema);

module.exports = Question;
