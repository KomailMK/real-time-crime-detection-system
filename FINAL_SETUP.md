# 🚀 Complete Setup Guide - Crime Detection System with MySQL

## ⚠️ Important: This Preview Only Shows the Frontend

The v0 preview environment **does not run your backend server**. To fully test the application, you need to:

1. Install dependencies on your system
2. Start the Flask backend server
3. Then access the frontend

---

## 📋 Prerequisites

### Windows, macOS, or Linux
- **Node.js** 18+ (for frontend)
- **Python** 3.9+ (for backend)
- **MySQL** 8.0+ (database)

### Check Installation
```bash
node --version      # Should show v18+
python --version    # Should show Python 3.9+
mysql --version     # Should show MySQL 8.0+
```

---

## 🔧 Step 1: Prepare Your Environment

### 1.1 Clone/Extract Project
```bash
cd crime-detection-system
```

### 1.2 Create Backend Environment File
Create `/backend/.env`:
```
# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DB=crime_detect_db

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Security Keys
SECRET_KEY=your-secret-key-change-this
JWT_SECRET=your-jwt-secret-change-this

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

---

## 🗄️ Step 2: Setup MySQL Database

### 2.1 Start MySQL Service

**Windows:**
```bash
# MySQL should be running as a service
# If not installed, download from https://dev.mysql.com/downloads/mysql/
```

**macOS (using Homebrew):**
```bash
brew services start mysql
```

**Linux (Ubuntu/Debian):**
```bash
sudo systemctl start mysql
```

### 2.2 Verify MySQL Connection
```bash
mysql -u root -p
# Enter your password, then type: exit
```

---

## 🐍 Step 3: Setup Backend

### 3.1 Create Python Virtual Environment
```bash
cd backend
python -m venv venv
```

### 3.2 Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

### 3.3 Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 3.4 Start Backend Server
```bash
python app.py
```

**Expected Output:**
```
2024-01-22 10:30:45 - INFO - Connecting to MySQL server...
2024-01-22 10:30:46 - INFO - Database initialized successfully
 * Running on http://127.0.0.1:5000
```

**Keep this terminal open!** The backend must be running.

---

## 📦 Step 4: Setup Frontend

### 4.1 Open New Terminal (keep backend running in other terminal)
```bash
cd path/to/project
```

### 4.2 Install Frontend Dependencies
```bash
npm install
```

### 4.3 Set Frontend Environment
Create `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

### 4.4 Start Frontend Development Server
```bash
npm run dev
```

**Expected Output:**
```
  ▲ Next.js 16.0.0
  - Local:        http://localhost:3000
```

---

## 🌐 Step 5: Access Your Application

1. Open browser: **http://localhost:3000**
2. You should see the Crime Detection login page
3. Click "Sign Up" to create a new account
4. Enter your email and details
5. You'll receive a 6-digit code (check console logs in backend terminal)
6. Enter the code to verify
7. Welcome to your dashboard!

---

## 🐳 Alternative: Using Docker (Easiest)

If you have Docker installed, this is much simpler:

### 5.1 Build and Run with Docker
```bash
docker-compose up
```

### 5.2 Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MySQL Database: localhost:3306

### 5.3 Stop Everything
```bash
docker-compose down
```

---

## 📧 Email Configuration (Optional)

The system can send verification codes via email. To enable:

### Using Gmail
1. Go to: https://myaccount.google.com/apppasswords
2. Generate an app password (16 characters)
3. Add to `.env`:
   ```
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=xxxx_xxxx_xxxx_xxxx
   ```

### Using Other Email Providers
Update SMTP settings in `.env` accordingly.

---

## 🔍 Troubleshooting

### "Failed to fetch" Error
- **Cause:** Backend server not running
- **Solution:** 
  1. Verify backend started: `python app.py`
  2. Check port 5000 is available
  3. Ensure CORS is configured

### "Connection refused" Error
- **Cause:** MySQL not running
- **Solution:**
  ```bash
  # Windows
  mysql -u root -p  # Should connect successfully
  
  # macOS
  brew services start mysql
  
  # Linux
  sudo systemctl start mysql
  ```

### "ModuleNotFoundError" in Python
- **Cause:** Missing dependencies
- **Solution:**
  ```bash
  cd backend
  pip install -r requirements.txt
  ```

### "Port 3000 already in use"
- **Solution:**
  ```bash
  # Windows
  netstat -ano | findstr :3000
  # Then kill the process
  
  # macOS/Linux
  lsof -i :3000
  kill -9 <PID>
  ```

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│ Browser (Frontend)                                      │
│ http://localhost:3000                                  │
│ Next.js + React + Tailwind CSS                         │
└────────────────────────┬────────────────────────────────┘
                         │
                    HTTP/REST
                         │
┌─────────────────────────┴────────────────────────────────┐
│ Backend API                                             │
│ http://localhost:5000                                  │
│ Flask + Python + SocketIO                              │
└────────────────────────┬────────────────────────────────┘
                         │
                      SQL
                         │
┌─────────────────────────┴────────────────────────────────┐
│ Database                                                │
│ localhost:3306                                         │
│ MySQL 8.0                                              │
└─────────────────────────────────────────────────────────┘
```

---

## 📚 API Endpoints

All endpoints require authentication (session cookie):

### Authentication
- `POST /api/auth/request-signup-code` - Request signup code
- `POST /api/auth/verify-signup-code` - Verify signup
- `POST /api/auth/request-login-code` - Request login code
- `POST /api/auth/verify-login-code` - Verify login
- `POST /api/auth/logout` - Logout

### Users
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update user profile

### Cameras
- `GET /api/cameras` - Get all user cameras
- `POST /api/cameras` - Add new camera
- `PUT /api/cameras/:id` - Update camera
- `DELETE /api/cameras/:id` - Delete camera

### Incidents
- `GET /api/incidents` - Get incidents with filters

### Alerts
- `GET /api/alerts` - Get alerts

---

## 🎯 Development Workflow

### Terminal 1: Start Backend
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python app.py
```

### Terminal 2: Start Frontend
```bash
npm run dev
```

### Terminal 3: Optional - Monitor Database
```bash
mysql -u root -p crime_detect_db
SHOW TABLES;
SELECT * FROM users;
```

---

## 📦 Project Structure

```
project/
├── backend/                 # Python Flask API
│   ├── app.py              # Main Flask app
│   ├── models.py           # Database models
│   ├── config.py           # Configuration
│   ├── database.py         # DB initialization
│   ├── auth_utils.py       # Authentication helpers
│   ├── requirements.txt     # Python dependencies
│   └── .env.example        # Example environment
├── app/                    # Next.js frontend
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── cameras/           # Camera management
│   ├── incidents/         # Incident tracking
│   ├── alerts/            # Alerts view
│   └── layout.tsx         # Root layout
├── lib/                   # Frontend utilities
│   ├── api.ts             # API client
│   └── context/           # React context
├── components/            # Reusable components
│   └── dashboard/         # Dashboard components
├── docker-compose.yml     # Docker orchestration
└── .env.example          # Example environment

```

---

## ✅ Verification Checklist

- [ ] MySQL is running
- [ ] Backend `.env` file created with correct credentials
- [ ] `pip install -r requirements.txt` completed
- [ ] `npm install` completed  
- [ ] Backend started: `python app.py`
- [ ] Frontend started: `npm run dev`
- [ ] Can access http://localhost:3000
- [ ] Can create account with email verification
- [ ] Can see dashboard after login

---

## 🚀 Ready to Go!

Your Crime Detection System is now ready to use. Start with:

```bash
# Terminal 1
cd backend && python app.py

# Terminal 2
npm run dev

# Open Browser
http://localhost:3000
```

**Need help?** Check the troubleshooting section above.
