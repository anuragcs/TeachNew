const express = require("express")
const router = express.Router()
const { submitTestAnswers } = require("../controllers/Test")
const { auth } = require("../middleware/auth")

// Route for students to submit test answers
router.post("/submit", auth, submitTestAnswers)

module.exports = router
