const express = require("express");
const router = express.Router();
const testController = require("../controllers/Test");

// Route to create or update test
router.post("/test", testController.createOrUpdateTest);

// Route to get test by courseId
router.get("/test/:courseId", testController.getTestByCourseId);

module.exports = router;
