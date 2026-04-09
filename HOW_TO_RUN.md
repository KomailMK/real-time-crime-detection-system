# How to Run - Crime Detection System (MySQL Version)

## 📋 Table of Contents
1. [Quick Start (Docker)](#quick-start-docker)
2. [Manual Setup](#manual-setup)
3. [Troubleshooting](#troubleshooting)
4. [System Requirements](#system-requirements)

---

## Quick Start (Docker)

### ✅ The Easiest Way (Recommended)

**Prerequisites:** Docker Desktop installed

**Run in 3 commands:**
```bash
# 1. Navigate to project folder
cd crime-detection-system

# 2. Start all services
docker-compose up

# 3. Open browser
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

**That's it!** Docker automatically:
- Creates MySQL database
- Sets up database schema
- Starts Flask backend
- Starts Next.js frontend

**Stop everything:**
```bash
docker-compose down
```

---

## Manual Setup

### System Requirements

| Component | Version | Purpose |
|-----------|---------|---------|
| Python | 3.11+ | Backend server |
| Node.js | 18+ | Frontend server |
| npm | 9+ | Package manager |
| MySQL | 8.0+ | Database |

### Step 1: Install Dependencies

#### Python (Backend)
```bash
# Check Python version
python --version  # Should be 3.11 or higher

# If not installed, download from python.org
```

#### Node.js (Frontend)
```bash
# Check Node.js version
node --version  # Should be 18 or higher
npm --version   # Should be 9 or higher

# If not installed, download from nodejs.org
```

#### MySQL Database
```bash
# Download from mysql.com or install via package manager

# Windows: https://dev.mysql.com/downloads/mysql/
# macOS: brew install mysql
# Linux: sudo apt-get install mysql-server
```

---

### Step 2: Setup MySQL Database

#### Create Database and User

```bash
# Connect to MySQL
mysql -u root -p

# You'll be prompted for password (set during MySQL installation)
```

Once connected, paste these commands:

```sql
-- Create database with UTF-8 support
CREATE DATABASE crime_detect_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (optional but recommended)
CREATE USER 'crimedetect'@'localhost' IDENTIFIED BY 'crimedetect123';

-- Grant permissions
GRANT ALL PRIVILEGES ON crime_detect_db.* TO 'crimedetect'@'localhost';
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

**Note:** If using root user directly, skip the CREATE USER step and use:
```sql
GRANT ALL PRIVILEGES ON crime_detect_db.* TO 'root'@'localhost';
```

---

### Step 3: Setup Backend

```bash
# Navigate to backend folder
cd backend

# Create .env file from template
# Windows:
copy .env.example .env

# macOS/Linux:
cp .env.example .env
```

**Edit `.env` file with your MySQL details:**
```bash
# Open .env with your editor and set:

MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root              # or 'crimedetect' if you created that user
MYSQL_PASSWORD=your_password # MySQL root password
MYSQL_DB=crime_detect_db

# Keep other settings as default
SECRET_KEY=your-secret-key-change-in-production
JWT_SECRET=your-jwt-secret-change-in-production
```

**Install Python packages:**
```bash
# Install all required Python packages
pip install -r requirements.txt

# This installs:
# - Flask (web framework)
# - SQLAlchemy (ORM)
# - PyMySQL (MySQL driver)
# - Flask-SocketIO (real-time updates)
# - etc.
```

**Start the backend:**
```bash
# Run the Flask application
python app.py

# You should see:
# ✓ Database initialized
# ✓ Tables created
# ✓ Running on http://127.0.0.1:5000
```

**Keep this terminal open!**

---

### Step 4: Setup Frontend

**Open a NEW terminal window/tab** and:

```bash
# Navigate to project root
cd path/to/crime-detection-system

# Install Node packages
npm install

# This installs:
# - Next.js (frontend framework)
# - React (UI library)
# - Tailwind CSS (styling)
# - etc.
```

**Start the development server:**
```bash
# Run Next.js development server
npm run dev

# You should see:
# ✓ Ready in X.XXs
# ✓ Local: http://localhost:3000
```

---

### Step 5: Access the Application

**Open your browser and visit:**

| What | URL |
|------|-----|
| Frontend (Main App) | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| MySQL Database | localhost:3306 |

---

## 🎯 First Time Use

### Create Account

1. Go to http://localhost:3000
2. Click the **"Sign Up"** tab
3. Fill in your details:
   ```
   Name: Your Name
   Email: your@email.com
   Phone: +1234567890 (optional)
   Address: 123 Main Street (optional)
   Property Type: House (or Shop/Office)
   ```
4. Click **"Create Account"**
5. You'll see: "Verification code sent to your email"

### Get Verification Code

**In development mode**, check the backend terminal for the code:
```
[v0] Verification code: 123456
```

Or check your email inbox (if SMTP configured).

### Verify Email

1. Enter the 6-digit code
2. Click **"Verify & Complete Signup"**
3. You'll be logged in! 🎉

### Explore Dashboard

Once logged in, you can:
- **Add Cameras** - Register your surveillance cameras
- **View Dashboard** - See online/offline status
- **Check Incidents** - View detected events
- **Manage Alerts** - See notifications
- **Update Profile** - Change user information

---

## 🛠️ Troubleshooting

### Problem: "Connection refused" on MySQL

**Solution:**
```bash
# Check if MySQL is running
mysqladmin -u root -p ping

# If "Can't connect", start MySQL:

# Windows: 
# Use Services (services.msc) to start MySQL service

# macOS:
brew services start mysql

# Linux:
sudo systemctl start mysql
```

### Problem: Backend won't start

**Check error message and try:**
```bash
# Clear Python cache
find . -type d -name __pycache__ -exec rm -r {} +

# Reinstall packages
pip install --upgrade -r requirements.txt

# Check Python version
python --version  # Must be 3.11+
```

### Problem: Frontend won't load

**Try:**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall packages
rm -rf node_modules
npm install

# Check Node version
node --version  # Must be 18+
```

### Problem: Port 3000 or 5000 already in use

**Solution:**
```bash
# Kill the process using the port (Linux/macOS):
lsof -ti:3000 | xargs kill -9  # For port 3000
lsof -ti:5000 | xargs kill -9  # For port 5000

# Windows (in Command Prompt as Admin):
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Or change the port:**
- Frontend: Just press 'Y' when prompted to use another port
- Backend: Edit `backend/app.py` line `if __name__ == '__main__': app.run(port=5000)`

### Problem: "database error" or "table doesn't exist"

**Solution:**
```bash
# Verify database exists
mysql -u root -p -e "SHOW DATABASES;"

# Check if tables created
mysql -u root -p crime_detect_db -e "SHOW TABLES;"

# If empty, restart backend - it auto-creates tables:
python app.py
```

### Problem: Email verification code not received

**For development:** Check backend terminal for code
**For production:** Configure SMTP settings in `.env`

---

## 📊 Verify Everything Works

### Test MySQL Connection
```bash
mysql -u root -p -h localhost
# You should see: mysql>
# Then type: EXIT;
```

### Test Backend
```bash
# Should see "Running on http://127.0.0.1:5000"
curl http://localhost:5000/
```

### Test Frontend
```bash
# Visit http://localhost:3000
# Should see login page
```

### Test Database
```bash
# In backend terminal, you should see:
# ✓ Database initialized
# ✓ Connecting to crime_detect_db...
# ✓ Tables created successfully
```

---

## 🔄 Daily Usage

### Starting the application

**Day 1, 2, 3... etc:**

```bash
# Terminal 1: Start Backend
cd backend
python app.py

# Terminal 2: Start Frontend
npm run dev

# Then open http://localhost:3000
```

### Stopping the application

```bash
# In each terminal, press: Ctrl + C

# Then to fully stop:
docker-compose down  # If using Docker
```

---

## 📁 Project Structure

```
crime-detection-system/
├── app/                          # Next.js Frontend
│   ├── auth/page.tsx            # Login/Signup
│   ├── dashboard/page.tsx       # Main dashboard
│   ├── cameras/page.tsx         # Camera management
│   ├── incidents/page.tsx       # Incident tracking
│   ├── alerts/page.tsx          # Alert notifications
│   └── profile/page.tsx         # User profile
│
├── backend/                      # Flask Backend
│   ├── app.py                   # Main application (577 lines)
│   ├── models.py                # Database models (97 lines)
│   ├── config.py                # Configuration
│   ├── database.py              # DB initialization
│   ├── auth_utils.py            # Authentication helpers
│   ├── requirements.txt         # Python dependencies
│   └── .env.example             # Environment template
│
├── components/                   # React Components
│   ├── ui/                      # UI components (buttons, cards, etc)
│   └── dashboard/               # Dashboard-specific components
│
├── docker-compose.yml           # Docker configuration
├── QUICK_START.md              # Quick start guide
├── MYSQL_SETUP_GUIDE.md        # Detailed MySQL guide
├── CHANGES_SUMMARY.md          # What changed
└── HOW_TO_RUN.md              # This file
```

---

## 🆘 Getting Help

### Check Logs

**Backend errors:**
```bash
# Look at the backend terminal output
# Shows database connection issues, API errors, etc.
```

**Frontend errors:**
```bash
# Open browser -> Press F12 (Developer Tools)
# Go to Console tab to see JavaScript errors
```

**Database issues:**
```bash
# Check MySQL error log:
# Windows: C:\ProgramData\MySQL\MySQL Server 8.0\Data\error.log
# macOS: /usr/local/var/mysql/error.log
# Linux: /var/log/mysql/error.log
```

### Common Error Messages

| Error | Solution |
|-------|----------|
| "Connection refused" | MySQL not running |
| "Unknown database" | Run backend to create DB |
| "Module not found" | `pip install -r requirements.txt` |
| "Port already in use" | Change port or kill process |
| "Can't find npm" | Restart terminal, Node.js not installed |

---

## ✅ Success Checklist

- [ ] MySQL installed and running
- [ ] Database `crime_detect_db` created
- [ ] Backend `.env` file configured
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can open http://localhost:3000
- [ ] Can create account
- [ ] Can see dashboard after login
- [ ] Sidebar navigation works
- [ ] Can add a camera

---

## 🎉 Ready to Go!

Once you complete all the steps above, your Crime Detection System is ready to use!

**Next steps:**
1. Add some cameras
2. Monitor the dashboard
3. Check incidents and alerts
4. Update your profile

For more details, see:
- [QUICK_START.md](./QUICK_START.md) - Fast reference
- [MYSQL_SETUP_GUIDE.md](./MYSQL_SETUP_GUIDE.md) - Detailed guide
- [CHANGES_SUMMARY.md](./CHANGES_SUMMARY.md) - What changed

Happy monitoring! 📹🔒
