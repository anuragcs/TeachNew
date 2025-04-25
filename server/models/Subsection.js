const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const SubSectionSchema = new mongoose.Schema({
  title: { type: String },
  timeDuration: { type: String },
  description: { type: String },
  videoUrl: { type: String },
  type: { type: String, enum: ["Lecture", "Test"], default: "Lecture" },
  testQuestions: [questionSchema],
});

module.exports = mongoose.model("SubSection", SubSectionSchema);
