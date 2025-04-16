const mailSender = require("../utils/mailSender");

// The previously non-working HTML template function
const contactUsEmail = (
  email,
  firstname,
  lastname,
  message,
  phoneNo,
  countrycode
) => {
  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>Contact Form Confirmation</title>
      <style>
          body {
              background-color: #ffffff;
              font-family: Arial, sans-serif;
              font-size: 16px;
              line-height: 1.4;
              color: #333333;
              margin: 0;
              padding: 0;
          }
          
          .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              text-align: center;
          }
          
          .logo {
              max-width: 200px;
              margin-bottom: 20px;
          }
          
          .message {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 20px;
          }
          
          .body {
              font-size: 16px;
              margin-bottom: 20px;
          }
          
          .cta {
              display: inline-block;
              padding: 10px 20px;
              background-color: #FFD60A;
              color: #000000;
              text-decoration: none;
              border-radius: 5px;
              font-size: 16px;
              font-weight: bold;
              margin-top: 20px;
          }
          
          .support {
              font-size: 14px;
              color: #999999;
              margin-top: 20px;
          }
          
          .highlight {
              font-weight: bold;
          }
      </style>
    </head>
    <body>
      <div class="container">
          <a href="http://localhost:3000"><img class="logo"
                  src="https://i.ibb.co/rKXTmsXf/teachnewlogo.png" alt="TeachNew Logo"></a>
          <div class="message">Contact Form Confirmation</div>
          <div class="body">
              <p>Dear ${firstname} ${lastname},</p>
              <p>Thank you for contacting us. We have received your message and will respond to you as soon as possible.</p>
              <p>Here are the details you provided:</p>
              <p>Name: ${firstname} ${lastname}</p>
              <p>Email: ${email}</p>
              <p>Phone Number: ${countrycode} ${phoneNo}</p>
              <p>Message: ${message}</p>
              <p>We appreciate your interest and will get back to you shortly.</p>
          </div>
          <div class="support">If you have any further questions or need immediate assistance, please feel free to reach
              out to us at <a href="mailto:ruindestroy007@gmail.com">Click to Mail Us</a>. We are here to help!</div>
      </div>
    </body>
  </html>`;
};

exports.contactUsController = async (req, res) => {
  try {
    const { firstname, lastname, email, countrycode, phoneNo, message } = req.body;
    
    console.log(req.body);
    
    // Construct admin email
    const mailBodyAdmin = `
      <h2>New Contact Us Query</h2>
      <p><strong>Name:</strong> ${firstname} ${lastname}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${countrycode} ${phoneNo}</p>
      <p><strong>Message:</strong> ${message}</p>
    `;
    
    // Send to admin
    const adminMailResponse = await mailSender(
      process.env.MAIL_USER,
      "New Contact Us Submission",
      mailBodyAdmin,
      email // replyTo user
    );
    
    // Use the nice HTML template for the user confirmation
    const mailBodyUser = contactUsEmail(
      email,
      firstname,
      lastname,
      message,
      phoneNo,
      countrycode
    );
    
    // Send confirmation to user
    const userMailResponse = await mailSender(
      email,
      "Thanks for contacting TeachNew",
      mailBodyUser
    );
    
    console.log("Emails sent successfully to admin and user.");
    
    res.status(200).json({ success: true, message: "Query submitted and confirmation sent!" });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};