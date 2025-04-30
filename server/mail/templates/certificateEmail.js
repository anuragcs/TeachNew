exports.certificateEmail = () => {
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Course Completion Certificate</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
      }
      .container {
        padding: 20px;
      }
      h1 {
        color: #4CAF50;
      }
      p {
        font-size: 16px;
      }
      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #777;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Congratulations on Completing Your Course!</h1>
      <p>Dear Student,</p>
      <p>We are pleased to inform you that your course completion certificate is attached to this email.</p>
      <p>Thank you for learning with us. We wish you all the best in your future endeavors!</p>
      <p>Best regards,<br/>The Teaching Platform Team</p>
      <div class="footer">
        <p>This is an automated message, please do not reply.</p>
      </div>
    </div>
  </body>
  </html>`;
};
