const mailSender = require("../utils/mailSender");
const { certificateEmail } = require("../mail/templates/certificateEmail");

exports.sendCertificateEmail = async (req, res) => {
  try {
    const { email, certificateBase64, fileName } = req.body;

    if (!email || !certificateBase64 || !fileName) {
      return res.status(400).json({
        success: false,
        message: "Email, certificate data and file name are required",
      });
    }

    // Prepare attachment object
    const attachment = {
      filename: fileName,
      content: Buffer.from(certificateBase64, "base64"),
      contentType: "application/pdf",
    };

    // Send email with attachment
    await mailSender(
      email,
      "Your Course Completion Certificate",
      certificateEmail(),
      [attachment]
    );

    return res.status(200).json({
      success: true,
      message: "Certificate sent to email successfully",
    });
  } catch (error) {
    console.error("Error sending certificate email:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send certificate email",
      error: error.message,
    });
  }
};
