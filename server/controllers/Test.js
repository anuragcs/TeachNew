const Test = require("../models/Test");

// Create or update test for a course
exports.createOrUpdateTest = async (req, res) => {
  try {
    const { courseId, testData } = req.body;

    if (!courseId || !testData) {
      return res.status(400).json({ message: "courseId and testData are required" });
    }

    let test = await Test.findOne({ courseId });

    if (test) {
      // Update existing test
      test.testData = testData;
      await test.save();
    } else {
      // Create new test
      test = new Test({ courseId, testData });
      await test.save();
    }

    return res.status(200).json(test);
  } catch (error) {
    console.error("Error in createOrUpdateTest:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get test by courseId
exports.getTestByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({ message: "courseId is required" });
    }

    const test = await Test.findOne({ courseId });

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    return res.status(200).json(test);
  } catch (error) {
    console.error("Error in getTestByCourseId:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
