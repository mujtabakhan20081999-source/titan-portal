const nodemailer = require('nodemailer');

// Gmail SMTP configuration with App Password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'mujtabalimitless@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'lucoutnijyqwadup',
  },
});

/**
 * Send a professional login welcome email
 * @param {string} recipientEmail - Email of the user who logged in
 * @param {string} fullName - Full name of the user
 * @param {string} role - Role of the user (student, teacher, admin, etc.)
 */
async function sendLoginEmail(recipientEmail, fullName, role) {
  try {
    const appName = 'TITAN Sukkur Management System';
    const currentDate = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    const subject = `Login Confirmation - ${appName}`;

    // Professional HTML email template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f5f5f5;
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 600;
            }
            .content {
              padding: 30px 20px;
              line-height: 1.6;
              color: #333;
            }
            .greeting {
              font-size: 16px;
              margin-bottom: 20px;
            }
            .info-section {
              background-color: #f9f9f9;
              border-left: 4px solid #667eea;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
              font-size: 14px;
            }
            .info-label {
              font-weight: 600;
              color: #555;
            }
            .info-value {
              color: #333;
            }
            .footer {
              background-color: #f5f5f5;
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #eee;
            }
            .warning {
              background-color: #fff3cd;
              border: 1px solid #ffc107;
              color: #856404;
              padding: 12px 15px;
              border-radius: 4px;
              font-size: 13px;
              margin-top: 20px;
            }
            a {
              color: #667eea;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Login Confirmation</h1>
            </div>
            <div class="content">
              <div class="greeting">
                <p>Hello <strong>${fullName}</strong>,</p>
                <p>Your account has been successfully logged into the ${appName}.</p>
              </div>

              <div class="info-section">
                <div class="info-row">
                  <span class="info-label">Account Email:</span>
                  <span class="info-value">${recipientEmail}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Account Role:</span>
                  <span class="info-value">${role.charAt(0).toUpperCase() + role.slice(1)}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Login Time:</span>
                  <span class="info-value">${currentDate}</span>
                </div>
              </div>

              <div class="warning">
                <strong>⚠️ Security Notice:</strong> If you did not perform this login, please change your password immediately and contact our support team.
              </div>

              <p style="margin-top: 20px; font-size: 14px;">
                If you have any questions or concerns, please don't hesitate to reach out to our support team.
              </p>
            </div>
            <div class="footer">
              <p>&copy; 2024 ${appName}. All rights reserved.</p>
              <p style="margin: 10px 0 0 0; font-size: 11px;">
                This is an automated message from our system. Please do not reply to this email.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Plain text version as fallback
    const textContent = `
Login Confirmation - ${appName}

Hello ${fullName},

Your account has been successfully logged into the ${appName}.

Login Details:
- Email: ${recipientEmail}
- Role: ${role.charAt(0).toUpperCase() + role.slice(1)}
- Login Time: ${currentDate}

SECURITY NOTICE: If you did not perform this login, please change your password immediately and contact our support team.

Best regards,
${appName} Team
    `.trim();

    const mailOptions = {
      from: process.env.EMAIL_USER || 'mujtabalimitless@gmail.com',
      to: recipientEmail,
      subject: subject,
      text: textContent,
      html: htmlContent,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Login email sent successfully to ${recipientEmail}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending login email:', error);
    // Log error but don't fail the login process
    return { success: false, error: error.message };
  }
}

/**
 * Test the email configuration
 */
async function testEmailConfiguration() {
  try {
    await transporter.verify();
    console.log('✅ Email service is configured and ready to send emails');
    return { success: true, message: 'Email service verified' };
  } catch (error) {
    console.error('❌ Email service configuration error:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendLoginEmail,
  testEmailConfiguration,
  transporter,
};
