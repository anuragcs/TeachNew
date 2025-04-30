const { contactUsEmail } = require("../mail/templates/contactFormRes")
const mailSender = require("../utils/mailSender")

exports.contactUsController = async (req, res) => {
  const { email, firstname, lastname, message, phoneNo, countrycode } = req.body
  console.log(req.body)
  try {
    // Send email to user
    const emailResUser = await mailSender(
      email,
      "Your Data send successfully",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    )
    // Send email to main author email
    const mainEmail = "ruindestroy007@gmail.com"
    const emailResMain = await mailSender(
      mainEmail,
      "New Contact Us Inquiry Received",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    )
    console.log("Email Res User:", emailResUser)
    console.log("Email Res Main:", emailResMain)
    return res.json({
      success: true,
      message: "Email sent successfully to user and main email.",
    })
  } catch (error) {
    console.log("Error", error)
    console.log("Error message :", error.message)
    return res.json({
      success: false,
      message: "Something went wrong...",
    })
  }
}
