const mongoose = require("mongoose");

const testAttemptSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  answers: [
    {
      question: { type: String, required: true },
      answer: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
    },
  ],
  score: { type: Number, required: true },
  attemptedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TestAttempt", testAttemptSchema);
