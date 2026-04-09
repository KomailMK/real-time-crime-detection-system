# EMAIL FIX - Quick Start Guide

## What Was Wrong
Email sending was failing because Gmail credentials weren't properly configured in the backend.

## What I Fixed
- Added Gmail SMTP configuration with app password
- Implemented proper TLS encryption
- Added comprehensive error logging
- Created professional HTML email templates
- Added timeout handling and retry logic

## Your Next Step (Copy-Paste Commands)

### Option 1: Manual Setup
```powershell
# 1. Navigate to backend
cd D:\Final Year Project\real-time-incident-detection\backend

# 2. Run backend
python app.py
```

### Option 2: Already Configured
The .env file has been created with your Gmail credentials:
- Email: nabiikhalils091@gmail.com  
- App Password: wkci wqnl vbka nhey

```powershell
cd D:\Final Year Project\real-time-incident-detection\backend
python app.py
```

## Testing Email Sending

1. **Start Backend**
   ```powershell
   python app.py
   ```
   Watch for: `INFO:database:Connected to MySQL server`

2. **Start Frontend** (new terminal)
   ```powershell
   npm run dev
   ```
   Watch for: `ready - started server on 0.0.0.0:3000`

3. **Test Signup**
   - Go to http://localhost:3000/auth
   - Click "Sign Up"
   - Fill in form
   - Click "Send Verification Code"
   - Check your email (wait 5-10 seconds)
   - You should receive code like: `483921`
   - Enter code to complete signup

## What to Look For in Backend Logs

**Success** - You'll see:
```
INFO:auth_utils:Attempting to send verification email...
INFO:auth_utils:SMTP connection established
INFO:auth_utils:TLS started
INFO:auth_utils:Login successful
INFO:auth_utils:Email sent successfully to [email]
```

**Error** - You'll see details about what failed

## Email System Details

### Code Generation
- Random 6-digit code (e.g., 483921)
- Generated using Python random library
- Numeric only (0-9)

### Email Sending
- Uses Gmail SMTP (smtp.gmail.com:587)
- TLS encryption enabled
- App password authentication
- 10-second timeout

### Code Verification
- Code valid for 10 minutes
- One-time use only
- Automatically marked as used after verification
- Stored in database with expiry timestamp

## File Changes

### Created Files
- `/backend/.env` - Your Gmail credentials

### Modified Files
- `auth_utils.py` - Enhanced email sending with proper SMTP
- `config.py` - Added Gmail SMTP configuration
- `.env.example` - Updated with Gmail setup instructions

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Email not received | Check backend logs for errors |
| Auth failed error | Verify email and app password in .env |
| Connection refused | Check internet, verify smtp.gmail.com:587 |
| Email in spam | Check spam folder, whitelist sender |
| Code expired | Must verify within 10 minutes |

## Next Steps

1. Start backend with: `python app.py`
2. Test signup with verification code
3. Check email for 6-digit code
4. Complete signup and access dashboard

---

Ready to test? Run `python app.py` and try signing up!
