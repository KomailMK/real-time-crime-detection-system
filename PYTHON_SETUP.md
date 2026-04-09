# Python & Dependencies Setup Guide

## Problem You're Facing
```
ERROR:database:Database initialization failed: No module named 'pymysql'
```

This error means the Python dependencies haven't been installed yet. Don't worry - it's a simple fix!

---

## Solution: Install Dependencies

### Step 1: Navigate to Backend Folder
Open PowerShell/Command Prompt and go to your backend directory:

```powershell
cd D:\Final Year Project\real-time-incident-detection\backend
```

### Step 2: Install Python Dependencies

Use pip to install all required packages from `requirements.txt`:

```bash
pip install -r requirements.txt
```

**This will install:**
- Flask (web framework)
- PyMySQL (MySQL driver)
- SQLAlchemy (database ORM)
- Flask-SocketIO (real-time updates)
- All other dependencies

### Step 3: Verify Installation

Check that PyMySQL is installed:

```bash
pip show pymysql
```

You should see output like:
```
Name: PyMySQL
Version: 1.1.0
Summary: Pure Python MySQL Driver
```

### Step 4: Run the App

Now you can run the app:

```bash
python app.py
```

You should see:
```
INFO:database:Connecting to MySQL server...
INFO:database:Database 'crime_detect_db' created successfully.
INFO:__main__:CrimeDetect API Server running on http://localhost:5000
```

---

## Troubleshooting

### Issue: "python: command not found"
**Solution:** Python isn't in your PATH
- Reinstall Python and check "Add Python to PATH" during installation
- Or use: `python3 app.py` or `py app.py`

### Issue: "pip: command not found"
**Solution:** Use pip with Python module:
```bash
python -m pip install -r requirements.txt
```

### Issue: MySQL Connection Failed
**Make sure MySQL is running:**
```bash
# Windows:
mysql -u root -p
# Press Enter, enter your password if set
# Type "quit" to exit
```

### Issue: "No module named 'flask'" (after installing)
**Solutions:**
1. Try: `pip install --upgrade pip`
2. Or: `python -m pip install -r requirements.txt`
3. Check Python version: `python --version` (should be 3.8 or higher)

---

## Full Environment Setup Checklist

### Prerequisites
- [ ] Python 3.8+ installed
- [ ] MySQL running on localhost:3306
- [ ] MySQL root password set (default: "your_password" in .env.example)
- [ ] Node.js 18+ installed (for frontend)

### Backend Setup
- [ ] Navigate to `/backend` folder
- [ ] Run: `pip install -r requirements.txt`
- [ ] Create `.env` file (copy from `.env.example`)
- [ ] Edit `.env` with your MySQL credentials
- [ ] Run: `python app.py`

### Frontend Setup
- [ ] Navigate to root folder
- [ ] Run: `npm install` (if not done yet)
- [ ] Run: `npm run dev`
- [ ] Open: http://localhost:3000

---

## Quick Copy-Paste Commands (Windows PowerShell)

```powershell
# Step 1: Go to backend
cd "D:\Final Year Project\real-time-incident-detection\backend"

# Step 2: Install dependencies
pip install -r requirements.txt

# Step 3: Run backend
python app.py
```

---

## Environment Variables (.env file)

Create a file named `.env` in the `backend` folder:

```
# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DB=crime_detect_db

# Email Configuration (optional for testing)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Security (change these in production)
SECRET_KEY=your-secret-key-change-in-production
JWT_SECRET=your-jwt-secret-change-in-production

# Flask Configuration
FLASK_ENV=development
FRONTEND_URL=http://localhost:3000
```

---

## Need More Help?

If you still get errors, please share:
1. Your Python version: `python --version`
2. Your pip version: `pip --version`
3. The full error message you're seeing
4. Output of: `pip list` (shows all installed packages)

---

## Next Steps

Once you see this message:
```
INFO:__main__:CrimeDetect API Server running on http://localhost:5000
```

You're ready to:
1. Open another PowerShell/Command Prompt window
2. Navigate to the project root
3. Run: `npm run dev`
4. Open: http://localhost:3000
5. Enjoy your application!

Happy coding! 🚀
