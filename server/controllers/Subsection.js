// Import necessary modules
const Section = require("../models/Section")
const SubSection = require("../models/Subsection")
const { uploadImageToCloudinary } = require("../utils/imageUploader")

// Create a new sub-section for a given section
exports.createSubSection = async (req, res) => {
  try {
    // Extract necessary information from the request body
    const { sectionId, title, description, type, testQuestions } = req.body
    const video = req.files ? req.files.video : null

    if (!sectionId || !title || !description) {
      return res
        .status(404)
        .json({ success: false, message: "Required fields are missing" })
    }

    let SubSectionDetails

    if (type === "Test") {
      // Parse testQuestions JSON string if needed
      let questions = []
      if (testQuestions) {
        try {
          questions = JSON.parse(testQuestions)
        } catch (err) {
          return res.status(400).json({
            success: false,
            message: "Invalid testQuestions format",
          })
        }
      }

      SubSectionDetails = await SubSection.create({
        title: title,
        description: description,
        type: "Test",
        testQuestions: questions,
      })
    } else {
      if (!video) {
        return res
          .status(404)
          .json({ success: false, message: "Video is required for lecture" })
      }
      // Upload the video file to Cloudinary
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      )
      SubSectionDetails = await SubSection.create({
        title: title,
        timeDuration: `${uploadDetails.duration}`,
        description: description,
        videoUrl: uploadDetails.secure_url,
        type: "Lecture",
      })
    }

    // Update the corresponding section with the newly created sub-section
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $push: { subSection: SubSectionDetails._id } },
      { new: true }
    ).populate("subSection")

    // Return the updated section in the response
    return res.status(200).json({ success: true, data: updatedSection })
  } catch (error) {
    // Handle any errors that may occur during the process
    console.error("Error creating new sub-section:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description, type, testQuestions } = req.body
    const subSection = await SubSection.findById(subSectionId)

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      })
    }

    if (title !== undefined) {
      subSection.title = title
    }

    if (description !== undefined) {
      subSection.description = description
    }

    if (type !== undefined) {
      subSection.type = type
    }

    if (type === "Test" && testQuestions !== undefined) {
      try {
        subSection.testQuestions = JSON.parse(testQuestions)
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid testQuestions format",
        })
      }
    }

    if (req.files && req.files.video !== undefined) {
      const video = req.files.video
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      )
      subSection.videoUrl = uploadDetails.secure_url
      subSection.timeDuration = `${uploadDetails.duration}`
    }

    await subSection.save()

    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    )

    console.log("updated section", updatedSection)

    return res.json({
      success: true,
      message: "Section updated successfully",
      data: updatedSection,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section",
    })
  }
}

exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          subSection: subSectionId,
        },
      }
    )
    const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })

    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found" })
    }

    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    )

    return res.json({
      success: true,
      message: "SubSection deleted successfully",
      data: updatedSection,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the SubSection",
    })
  }
}
