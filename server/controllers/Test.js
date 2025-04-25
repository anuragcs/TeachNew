const Course = require("../models/Course")

// Submit test answers and get score
exports.submitTestAnswers = async (req, res) => {
  try {
    const userId = req.user.id
    const { courseId, answers } = req.body

    if (!courseId || !answers || !Array.isArray(answers) || answers.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Course ID and 10 answers are required",
      })
    }

    // Get the course with test questions
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      })
    }

    if (!course.test || course.test.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Test questions not found for this course",
      })
    }

    // Calculate score by comparing answers
    let score = 0
    for (let i = 0; i < 10; i++) {
      if (
        answers[i].trim().toLowerCase() ===
        course.test[i].answer.trim().toLowerCase()
      ) {
        score++
      }
    }

    // TODO: Save the student's test attempt and score if needed

    return res.status(200).json({
      success: true,
      score,
      totalQuestions: 10,
      message: `You scored ${score} out of 10`,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Failed to submit test answers",
      error: error.message,
    })
  }
}
