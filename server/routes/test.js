const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const testController = require("../controllers/testController");

// Get test questions for a course
router.get("/questions/:courseId", auth, testController.getTestQuestions);

// Submit test answers
router.post("/submit", auth, testController.submitTestAnswers);

module.exports = router;
