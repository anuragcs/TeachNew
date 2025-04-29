const mongoose = require("mongoose");

const TestSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  testData: {
    type: Object, // Store SurveyJS JSON schema for the test
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Test", TestSchema);
