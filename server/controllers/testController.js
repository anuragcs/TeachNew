const Course = require("../models/Course");
const SubSection = require("../models/Subsection");
const TestAttempt = require("../models/TestAttempt");

// Get test questions for a course
exports.getTestQuestions = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).populate({
      path: "courseContent",
      populate: {
        path: "subSection",
        match: { type: "Test" },
      },
    });

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Collect all test questions from test subsections
    let testQuestions = [];
    course.courseContent.forEach((section) => {
      section.subSection.forEach((sub) => {
        if (sub.type === "Test" && sub.testQuestions) {
          testQuestions = testQuestions.concat(sub.testQuestions);
        }
      });
    });

    res.status(200).json({ success: true, data: testQuestions });
  } catch (error) {
    console.error("Error fetching test questions:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Submit test answers and calculate score
exports.submitTestAnswers = async (req, res) => {
  try {
    const { courseId, userId, answers } = req.body;

    if (!courseId || !userId || !answers) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Fetch test questions for the course
    const course = await Course.findById(courseId).populate({
      path: "courseContent",
      populate: {
        path: "subSection",
        match: { type: "Test" },
      },
    });

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    let testQuestions = [];
    course.courseContent.forEach((section) => {
      section.subSection.forEach((sub) => {
        if (sub.type === "Test" && sub.testQuestions) {
          testQuestions = testQuestions.concat(sub.testQuestions);
        }
      });
    });

    // Calculate score
    let score = 0;
    const detailedAnswers = answers.map((ans) => {
      const question = testQuestions.find((q) => q.question === ans.question);
      const isCorrect = question && question.answer.trim().toLowerCase() === ans.answer.trim().toLowerCase();
      if (isCorrect) score++;
      return { question: ans.question, answer: ans.answer, isCorrect };
    });

    // Save test attempt
    const testAttempt = await TestAttempt.create({
      courseId,
      userId,
      answers: detailedAnswers,
      score,
    });

    res.status(200).json({ success: true, data: { score, total: testQuestions.length }, testAttempt });
  } catch (error) {
    console.error("Error submitting test answers:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
