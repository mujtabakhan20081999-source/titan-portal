# Email Configuration Guide - TITAN Sukkur Management System

## Overview
The system now sends professional login confirmation emails to students and teachers when they successfully log in. This uses Gmail SMTP with Nodemailer.

## Setup Instructions

### 1. Install Nodemailer
```bash
cd backend
npm install nodemailer
```

### 2. Configure Environment Variables
Create or update your `.env` file in the `backend` directory with:

```env
EMAIL_USER=mujtabalimitless@gmail.com
EMAIL_PASSWORD=lucoutnijyqwadup
```

### 3. Gmail App Password Setup (One-time)
If you haven't already:

1. Go to your Gmail account: https://myaccount.google.com/security
2. Enable **2-Step Verification** if not already enabled
3. Generate an **App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Copy the 16-character password (without spaces)
   - Paste into `.env` as `EMAIL_PASSWORD`

**Note**: Never use your regular Gmail password. Always use the App Password for security.

## Features

### Login Email
When a student or teacher logs in successfully:
- ✅ Professional HTML email is sent
- ✅ Contains login timestamp
- ✅ Displays user role (Student/Teacher/Admin)
- ✅ Security notice about unauthorized access
- ✅ Plain text fallback for all email clients

### Email Content
The email includes:
- User's full name
- Email address
- Login date and time
- User role
- Security warning about unauthorized access

## API Endpoints

### Login (Existing Endpoint - Now Sends Email)
```
POST /api/auth/login
Body: { identifier: "email/cnic", password: "..." }
```
✅ Email sent automatically on successful login

### Test Email (New Admin-Only Endpoint)
```
POST /api/auth/test-email
Headers: { Authorization: "Bearer <admin-token>" }
Body: { email: "test@example.com" }
```
Use this to test email configuration. Only admins can access this.

## Troubleshooting

### "Failed to send email" Error
**Solution**: 
- Verify `EMAIL_USER` and `EMAIL_PASSWORD` are correct in `.env`
- Check that Gmail 2-Factor Authentication is enabled
- Verify the App Password is correct (16 characters, without spaces)
- Restart the server: `npm run dev`

### Emails Not Received
- Check email spam/junk folder
- Verify recipient email is correct
- Check console logs for error messages
- Test with the `/api/auth/test-email` endpoint

### "Service Connection Failed"
- Ensure internet connection is active
- Verify Gmail allows SMTP access
- Check if port 587 (Gmail SMTP) is not blocked by firewall

## Email Template Customization

To customize the email template, edit [utils/emailService.js](../utils/emailService.js):

```javascript
// Modify the htmlContent variable for HTML design
// Modify the textContent variable for plain text version
```

### Available Variables in Email Template:
- `recipientEmail` - User's email address
- `fullName` - User's full name
- `role` - User's role (student/teacher/admin)
- `currentDate` - Login timestamp

## Security Notes

1. **App Password Only**: Never use your Gmail account password directly
2. **Environment Variables**: Keep credentials in `.env`, never commit to git
3. **HTTPS Only**: Always use HTTPS in production
4. **Email Logging**: Emails are logged to console with message IDs for audit trail

## Testing in Development

### Using the Test Endpoint:
```bash
# 1. Get admin token from login
# 2. Send test email:
curl -X POST http://localhost:5000/api/auth/test-email \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Check Logs
The server logs all email operations:
```
✅ Login email sent successfully to user@example.com: <messageId>
```

## Advanced Configuration

### Change Email Sender Name
Edit [utils/emailService.js](../utils/emailService.js):
```javascript
from: `"${appName}" <${process.env.EMAIL_USER}>` // Add display name
```

### Add More Email Types
Add new functions in `emailService.js`:
```javascript
async function sendPasswordResetEmail(email, resetLink) {
  // Implementation here
}
```

Then call from relevant routes.

### Disable Emails Temporarily
Comment out the `sendLoginEmail()` call in [routes/authRoutes.js](../routes/authRoutes.js) (line ~234).

## Support

For issues or customization needs:
1. Check the console logs for specific error messages
2. Verify all environment variables are set correctly
3. Test using the `/api/auth/test-email` endpoint
4. Check Gmail security settings

## Files Modified/Created

- ✅ **Created**: `utils/emailService.js` - Email service configuration
- ✅ **Updated**: `routes/authRoutes.js` - Added email on login + test endpoint
- ✅ **Updated**: `server.js` - Email configuration verification on startup
- ✅ **Created**: `.env.example` - Environment variable template
- ✅ **Created**: `docs/EMAIL_SETUP.md` - This guide

## Next Steps

1. Ensure your `.env` file is configured
2. Run `npm run dev` in the backend folder
3. Monitor console for "✅ Email service is configured" message
4. Test by logging in or using the `/api/auth/test-email` endpoint
5. Check the recipient's inbox and spam folder

---

**Last Updated**: 2024
**Nodemailer Version**: Latest
**Gmail SMTP**: Supported
