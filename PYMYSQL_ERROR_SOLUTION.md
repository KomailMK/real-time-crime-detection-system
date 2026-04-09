# PyMySQL Missing Module - Complete Solution

## The Error You Got

```
PS D:\Final Year Project\real-time-incident-detection\backend> python app.py
INFO:database:Connecting to MySQL server...
ERROR:database:Database initialization failed: No module named 'pymysql'
ERROR:__main__:Failed to initialize database: No module named 'pymysql'
```

## What This Means

Python tried to start the application, but couldn't find the `pymysql` module (the MySQL database driver). This is **100% normal** - you just need to install the Python dependencies.

## The Root Cause

When you run `python app.py`, Python looks for all the imported modules:
- Flask
- PyMySQL ← Missing!
- SQLAlchemy
- Flask-Mail
- etc.

These packages are listed in `requirements.txt` but haven't been installed yet on your computer.

## The Solution

### Quick Fix (Copy-Paste)

```powershell
# Navigate to backend
cd D:\Final Year Project\real-time-incident-detection\backend

# Install all dependencies
pip install -r requirements.txt

# Run the app
python app.py
```

### Detailed Explanation

**Step 1: Navigate to Backend Folder**
```powershell
cd "D:\Final Year Project\real-time-incident-detection\backend"
```

**Step 2: Install Dependencies from requirements.txt**

This file lists all Python packages needed:
```
Flask==2.3.3
Flask-CORS==4.0.0
Flask-SocketIO==5.3.4
Flask-Mail==0.9.1
SQLAlchemy==2.0.21
PyMySQL==1.1.0                    ← This was missing
python-dotenv==1.0.0
PyJWT==2.8.1
python-socketio==5.9.0
python-engineio==4.7.1
eventlet==0.33.3
Werkzeug==2.3.7
```

Install them:
```powershell
pip install -r requirements.txt
```

**What you'll see:**
```
Collecting Flask==2.3.3
Downloading Flask-2.3.3-py3-none-any.whl (101 kB)
Installing collected packages: Werkzeug, click, itsdangerous, Flask...
Successfully installed Flask-2.3.3 PyMySQL-1.1.0 ...
```

**Step 3: Verify Installation**

Check that PyMySQL is installed:
```powershell
pip show pymysql
```

Output should be:
```
Name: PyMySQL
Version: 1.1.0
Summary: Pure Python MySQL Driver
Location: C:\Users\YourName\AppData\Local\Programs\Python\Python311\site-packages
```

**Step 4: Run the Application**

```powershell
python app.py
```

Success! You should see:
```
INFO:database:Connecting to MySQL server...
INFO:database:Database 'crime_detect_db' created successfully.
INFO:database:Tables created successfully.
INFO:__main__:CrimeDetect API Server running on http://localhost:5000
```

## Why This Happens

When Python packages are published on PyPI (Python Package Index), they're not included in the Python installation. Instead:

1. You list all required packages in `requirements.txt`
2. You tell pip to install them: `pip install -r requirements.txt`
3. pip downloads and installs each package from PyPI
4. Your application can now import them

This is standard practice for all Python projects!

## Alternative Installation Methods

### Using PowerShell Setup Script
```powershell
.\setup.ps1
```

### Using Batch Script (Windows)
```cmd
setup.bat
```

### Using Python Module
```powershell
python -m pip install -r requirements.txt
```

### Installing Specific Package
```powershell
pip install PyMySQL==1.1.0
```

## Troubleshooting

### Error: "pip: command not found"
**Solution:**
```powershell
python -m pip install -r requirements.txt
```

### Error: "python: command not found"
**Solutions:**
- Try: `python3 app.py`
- Try: `py app.py`
- Reinstall Python with "Add Python to PATH" checked

### Error: Permission denied
**Solution (Windows - Run as Administrator):**
```powershell
# Right-click PowerShell → Run as administrator
pip install -r requirements.txt
```

### Error: Upgrade pip first
**Solution:**
```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### Error: Module imported but still not found
**Solution:**
```powershell
# Reinstall with force
pip install --force-reinstall -r requirements.txt
```

## Complete Setup Checklist

- [ ] Python 3.8+ installed
- [ ] MySQL running and working
- [ ] Created `.env` file in backend folder
- [ ] Ran `pip install -r requirements.txt`
- [ ] Verified with `pip show pymysql`
- [ ] Backend starts: `python app.py` (shows "running on http://localhost:5000")
- [ ] Frontend runs: `npm run dev` (in another terminal)
- [ ] Browser loads: http://localhost:3000

## What Gets Installed

**Size:** ~50-100 MB
**Time:** 2-5 minutes (depends on internet)
**Dependencies:** 12 packages + their dependencies (transitive)

### Main Packages:
- **Flask** (web framework)
- **PyMySQL** (MySQL driver)
- **SQLAlchemy** (database ORM)
- **Flask-SocketIO** (real-time updates)
- **Flask-Mail** (email sending)
- **Flask-CORS** (cross-origin requests)
- **Python-dotenv** (environment variables)
- **PyJWT** (authentication tokens)
- **Eventlet** (async processing)

### Transitive Dependencies:
Many packages depend on other packages, so `pip install -r requirements.txt` installs everything needed automatically.

## Verification

After installation, your backend should:

1. ✅ Connect to MySQL
2. ✅ Create database if not exists
3. ✅ Create tables if not exist
4. ✅ Start Flask server on port 5000
5. ✅ Listen for API requests from frontend

## Next Steps

Once backend is running:

1. **Open new PowerShell/Command Prompt**
2. **Navigate to project root**
3. **Run:** `npm run dev`
4. **Open:** http://localhost:3000

You're all set! 🎉

## If You Need Help

1. **Double-check you're in the backend folder:**
   ```powershell
   cd "D:\Final Year Project\real-time-incident-detection\backend"
   dir  # Should show: app.py, models.py, requirements.txt
   ```

2. **Verify requirements.txt exists:**
   ```powershell
   cat requirements.txt
   # Should show all the packages
   ```

3. **Check Python version:**
   ```powershell
   python --version
   # Should be 3.8 or higher
   ```

4. **Manual install if needed:**
   ```powershell
   pip install Flask==2.3.3
   pip install PyMySQL==1.1.0
   pip install SQLAlchemy==2.0.21
   # ... etc for each package
   ```

5. **Share error output if still stuck:**
   - Copy full error message
   - Include output of: `pip list`
   - Include output of: `python --version`

## Summary

| What | How |
|------|-----|
| Error | No module named 'pymysql' |
| Cause | Dependencies not installed |
| Fix | `pip install -r requirements.txt` |
| Time | 2-5 minutes |
| Result | Backend runs on http://localhost:5000 |

---

**You're almost there!** Just install the dependencies and you'll be running a production-grade security system. 🚀
