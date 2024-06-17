const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  questionsAnswered: [
    {
      questionId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Question',
        required: true
      },
      correct: Boolean,
      answeredAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  score: {
    type: Number,
    default: 0
  }
});

const UserActivity = mongoose.model('UserActivity', userActivitySchema);

module.exports = UserActivity;