# Getting Started - Crime Detection System

## You're Here Because:
You got this error:
```
ERROR:database:Database initialization failed: No module named 'pymysql'
```

**This is NORMAL and EASY to fix!** Just follow the steps below.

---

## What You Need (Prerequisites)

Before starting, make sure you have:
- Windows 10/11 (or macOS/Linux)
- MySQL 8.0 installed and running
- Python 3.8 or higher
- Node.js 18 or higher
- A text editor (VS Code, Notepad++, etc.)

### Check What You Have

**Check Python:**
```powershell
python --version
```
Should show: `Python 3.8.0` or higher

**Check Node.js:**
```powershell
node --version
npm --version
```

**Check MySQL:**
Open MySQL Command Line or MySQL Workbench and connect to verify it's running.

---

## Step-by-Step Setup

### Step 1: Install Python Dependencies (THIS IS YOUR ISSUE!)

Open PowerShell/Command Prompt and navigate to your backend folder:

```powershell
cd "D:\Final Year Project\real-time-incident-detection\backend"
```

**Option A: Run Setup Script (Easiest)**

Double-click: `setup.bat` (Windows Command Prompt)

Or in PowerShell:
```powershell
.\setup.ps1
```

**Option B: Manual Installation**

```powershell
pip install -r requirements.txt
```

You'll see packages being installed:
```
Collecting Flask==2.3.3
Collecting PyMySQL==1.1.0
Collecting SQLAlchemy==2.0.21
...
Successfully installed Flask-2.3.3 PyMySQL-1.1.0 ...
```

### Step 2: Create Environment File

In the `backend` folder, create a file named `.env`:

**Content:**
```
# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DB=crime_detect_db

# Email (optional, for later)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Security (change in production)
SECRET_KEY=your-secret-key-change-in-production
JWT_SECRET=your-jwt-secret-change-in-production

# Flask
FLASK_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Important:** Change `MYSQL_PASSWORD` to your actual MySQL root password!

### Step 3: Verify MySQL is Running

**Test MySQL Connection:**
```powershell
mysql -u root -p
# Enter your MySQL root password
# Type "quit" to exit
```

If this doesn't work:
- Start MySQL from Services or MySQL Workbench
- Windows: Services → Search for "MySQL" → Right-click → Start

### Step 4: Run Backend Server

In PowerShell (from backend folder):

```powershell
python app.py
```

**Success looks like:**
```
INFO:database:Connecting to MySQL server...
INFO:database:Database 'crime_detect_db' created successfully.
INFO:database:Tables created successfully.
INFO:__main__:CrimeDetect API Server running on http://localhost:5000
```

**Keep this window open!** The backend server needs to keep running.

### Step 5: Run Frontend (New PowerShell Window)

Open a NEW PowerShell/Command Prompt window:

```powershell
# Navigate to project root
cd "D:\Final Year Project\real-time-incident-detection"

# Install Node dependencies (if not done)
npm install

# Start frontend
npm run dev
```

**Success looks like:**
```
> crime-detection@1.0.0 dev
> next dev
⟳ compiling...
✓ compiled client and server successfully
```

### Step 6: Open Application

Open your browser and go to:
```
http://localhost:3000
```

You should see the **Backend Info Page** explaining the system is ready!

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Your Computer                             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Terminal 1: Backend (Port 5000)                             │
│  ├─ Flask Server                                             │
│  ├─ API Endpoints                                            │
│  └─ Connected to MySQL Database                              │
│                                                               │
│  Terminal 2: Frontend (Port 3000)                            │
│  ├─ Next.js Server                                           │
│  ├─ React UI                                                 │
│  └─ Communicates with Backend                                │
│                                                               │
│  MySQL Database                                              │
│  ├─ Users table                                              │
│  ├─ Cameras table                                            │
│  ├─ Incidents table                                          │
│  └─ Alerts table                                             │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Common Issues & Solutions

### Issue 1: "No module named 'pymysql'"
```
ERROR:database:Database initialization failed: No module named 'pymysql'
```
**Solution:**
```powershell
pip install -r requirements.txt
```
Or use the setup script: `setup.bat` or `.\setup.ps1`

### Issue 2: "Cannot connect to MySQL server"
```
ERROR:database:Database initialization failed: (2003, "Can't connect...")
```
**Solutions:**
1. Make sure MySQL is running
2. Check your `.env` file - MYSQL_PASSWORD should match your root password
3. Try connecting manually: `mysql -u root -p`

### Issue 3: "Address already in use: port 5000"
```
ERROR: Failed to bind to port 5000
```
**Solutions:**
1. Close other Flask servers
2. Use different port: `python app.py --port 5001`
3. Kill process: `netstat -ano | findstr :5000`

### Issue 4: "npm: command not found"
```
'npm' is not recognized as an internal or external command
```
**Solution:** Node.js isn't installed or in PATH
- Install from https://nodejs.org/
- Restart PowerShell after installation

### Issue 5: "Python not found"
```
'python' is not recognized
```
**Solutions:**
- Try: `python3 app.py`
- Try: `py app.py`
- Reinstall Python with "Add to PATH" checked

### Issue 6: "ModuleNotFoundError" for other packages
```
ModuleNotFoundError: No module named 'flask'
```
**Solution:**
```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

---

## File Structure

```
D:\Final Year Project\real-time-incident-detection\
├── backend/                    # Python Flask Backend
│   ├── app.py                 # Main Flask application
│   ├── models.py              # Database models
│   ├── config.py              # Configuration
│   ├── requirements.txt        # Python dependencies ← Install these!
│   ├── setup.bat              # Windows setup script
│   ├── setup.ps1              # PowerShell setup script
│   └── .env                   # Your local config (create this)
│
├── app/                        # Next.js Frontend
│   ├── page.tsx               # Home page
│   ├── auth/                  # Login/Signup
│   ├── dashboard/             # Main dashboard
│   ├── cameras/               # Camera management
│   ├── incidents/             # Incident tracking
│   └── alerts/                # Alerts page
│
├── lib/                        # Frontend utilities
├── components/                 # React components
├── package.json               # Node dependencies
└── README.md                  # Documentation
```

---

## Next Steps

Once everything is running:

1. **Create an Account**
   - Go to http://localhost:3000/auth
   - Click "Sign Up"
   - Enter your email
   - You'll receive a 6-digit verification code
   - Check terminal for the code (since email not fully set up yet)

2. **Add a Camera**
   - Login and go to Cameras
   - Click "Add Camera"
   - Enter details (name, location, etc.)

3. **View Dashboard**
   - See live camera status
   - Check incidents and alerts
   - Manage your account

4. **Customize**
   - Update UI colors in `app/globals.css`
   - Add more camera features in `components/dashboard/`
   - Extend API endpoints in `backend/app.py`

---

## Getting Help

If you're stuck:

1. **Check the error message** - Often tells you exactly what's wrong
2. **Check your `.env` file** - Make sure MySQL password is correct
3. **Verify MySQL is running** - Open MySQL Workbench or Command Line
4. **Restart services** - Kill terminals and start fresh
5. **Check Python version** - Must be 3.8+ : `python --version`
6. **Check all dependencies** - `pip list | grep -i flask` or `pip list | grep -i pymysql`

---

## Success Checklist

When you see these messages, you're ready:

**Backend:**
```
INFO:__main__:CrimeDetect API Server running on http://localhost:5000
```

**Frontend:**
```
✓ compiled client and server successfully
```

**Browser:** http://localhost:3000 loads without errors

---

## System Requirements Summary

| Component | Requirement | How to Check |
|-----------|------------|--------------|
| Python | 3.8+ | `python --version` |
| Node.js | 18+ | `node --version` |
| MySQL | 8.0+ | MySQL Workbench |
| RAM | 4GB+ | Task Manager |
| Disk | 2GB free | File Explorer |

---

## Production Deployment

Once you're comfortable, you can deploy using:
- Docker Compose: `docker-compose up`
- Cloud: AWS, Azure, Vercel
- VPS: DigitalOcean, Linode

See `FINAL_SETUP.md` for deployment instructions.

---

**Congratulations! You're about to run a production-grade security system. Enjoy!** 🚀

Have questions? Check the other documentation files in the root folder.
