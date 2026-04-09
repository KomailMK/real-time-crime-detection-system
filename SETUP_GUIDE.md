# Complete Setup Guide: Crime Detection System

This guide will walk you through setting up and running the Crime Detection System on your local machine.

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Quick Start with Docker](#quick-start-with-docker)
3. [Manual Local Setup](#manual-local-setup)
4. [Running the Application](#running-the-application)
5. [Testing the System](#testing-the-system)
6. [Troubleshooting](#troubleshooting)

---

## System Requirements

### Minimum Requirements
- 4GB RAM
- 10GB disk space
- Internet connection

### Option 1: Docker (Recommended - Easiest)
- **Docker Desktop** 4.0+
- **Docker Compose** 2.0+

Download from: https://www.docker.com/products/docker-desktop

### Option 2: Local Development
- **Node.js** 18.0+
- **Python** 3.11+
- **Microsoft SQL Server 2022**
- **npm** 9.0+
- **pip** (comes with Python)

---

## Quick Start with Docker (Recommended)

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/crime-detection.git
cd crime-detection
```

### Step 2: Set Up Environment Variables

#### For Email Configuration
Gmail SMTP is pre-configured. To enable email notifications:

1. **Go to your Gmail account**: https://myaccount.google.com/
2. **Enable 2-Step Verification**:
   - Click "Security" in the left sidebar
   - Enable "2-Step Verification"
3. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Google will generate a 16-character password
   - Copy this password

4. **Create backend/.env file**:
```bash
cp backend/.env.example backend/.env
```

5. **Edit backend/.env** with your credentials:
```env
SQLSERVER_HOST=sqlserver
SQLSERVER_PORT=1433
SQLSERVER_USER=sa
SQLSERVER_PASSWORD=YourPassword123!
SQLSERVER_DB=CrimeDetectDB
SQLALCHEMY_DRIVER=ODBC Driver 18 for SQL Server

SECRET_KEY=your-super-secret-key-change-this-2024
JWT_SECRET=your-jwt-secret-change-this-2024

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password

SOCKETIO_ASYNC_MODE=eventlet
FRONTEND_URL=http://localhost:3000
```

### Step 3: Start with Docker Compose
```bash
docker-compose up -d
```

**Wait 30-60 seconds for all services to start**

### Step 4: Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/admin/health
- **SQL Server**: localhost:1433

### Verify Services are Running
```bash
docker-compose ps
```

You should see:
- `crime-detect-db` - running
- `crime-detect-api` - running  
- `crime-detect-web` - running

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
# All logs
docker-compose logs

# Backend logs only
docker-compose logs backend

# Follow logs in real-time
docker-compose logs -f backend
```

---

## Manual Local Setup

### Step 1: Install SQL Server

#### Windows
1. Download SQL Server 2022 from: https://www.microsoft.com/sql-server
2. Run the installer
3. Choose "Express" edition (free)
4. Default instance name is recommended
5. Enable TCP/IP in SQL Server Configuration Manager
6. Default credentials: `sa` / (your password set during install)

#### macOS
Use Docker for SQL Server:
```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourPassword123!" \
  -p 1433:1433 \
  mcr.microsoft.com/mssql/server:2022-latest
```

#### Linux
Use Docker or install native SQL Server via package manager

### Step 2: Install Backend Dependencies

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

### Step 3: Configure Backend

```bash
# Copy and edit environment file
cp .env.example .env
```

Edit `.env` with your credentials:
```env
SQLSERVER_HOST=localhost
SQLSERVER_PORT=1433
SQLSERVER_USER=sa
SQLSERVER_PASSWORD=your-sql-password
SQLSERVER_DB=CrimeDetectDB
SQLALCHEMY_DRIVER=ODBC Driver 18 for SQL Server

SECRET_KEY=change-this-to-random-string
JWT_SECRET=change-this-to-another-random-string

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password

SOCKETIO_ASYNC_MODE=eventlet
```

### Step 4: Start Backend Server

```bash
# From /backend directory with virtual environment activated
python app.py
```

**Expected output:**
```
[2024-XX-XX XX:XX:XX] INFO: Database initialized successfully
[2024-XX-XX XX:XX:XX] INFO: Database 'CrimeDetectDB' already exists
[2024-XX-XX XX:XX:XX] INFO: Database tables created successfully
Running on http://0.0.0.0:5000
```

### Step 5: Install Frontend Dependencies

```bash
# In a new terminal, from project root
npm install
```

### Step 6: Configure Frontend

```bash
# Create environment file
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_WS_URL=ws://localhost:5000/socket.io
```

### Step 7: Start Frontend Server

```bash
npm run dev
```

**Expected output:**
```
> next dev
  ▲ Next.js 16.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local
```

---

## Running the Application

### With Docker (1 command)
```bash
docker-compose up
```

### Manual (3 terminal windows)

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python app.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

**Terminal 3 - SQL Server (if using Docker):**
```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourPassword123!" \
  -p 1433:1433 \
  mcr.microsoft.com/mssql/server:2022-latest
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: curl http://localhost:5000/api/admin/health

---

## Testing the System

### Step 1: Create an Account

1. Go to http://localhost:3000
2. Click "Sign Up" tab
3. Enter:
   - Name: Test User
   - Email: test@example.com
   - Phone: 555-1234
   - Address: 123 Test St
   - Property Type: House
4. Click "Send Verification Code"
5. Check your email inbox (or spam folder)
6. Copy the 6-digit code
7. Paste the code and click "Verify & Sign Up"

**Note:** If Gmail SMTP isn't configured, check backend logs for the generated code.

### Step 2: Add a Camera

1. From dashboard, click "Add Camera"
2. Enter:
   - Camera ID: `test-cam-001`
   - Camera Name: `Front Door`
   - Stream URL: `rtsp://camera-ip:554/stream`
   - Location: `Main Entrance`
3. Click "Add Camera"

### Step 3: View Dashboard

- Camera grid shows registered cameras
- Click on a camera to see details
- Status shows "online" or "offline"

### Step 4: Test API Endpoints

```bash
# Get all cameras
curl -X GET http://localhost:5000/api/cameras \
  -H "Cookie: session=your-session-cookie" \
  -H "Content-Type: application/json"

# Get user profile
curl -X GET http://localhost:5000/api/users/me \
  -H "Cookie: session=your-session-cookie" \
  -H "Content-Type: application/json"

# Get incidents
curl -X GET http://localhost:5000/api/incidents?limit=10 \
  -H "Cookie: session=your-session-cookie" \
  -H "Content-Type: application/json"

# Health check
curl http://localhost:5000/api/admin/health
```

### Step 5: Test Real-Time Features

1. Open dashboard in two browser windows
2. Add a new camera in one window
3. The other window automatically updates (if WebSocket connected)

---

## Troubleshooting

### Docker Issues

#### "docker: command not found"
- Install Docker Desktop from https://www.docker.com/products/docker-desktop
- Restart your terminal

#### SQL Server won't start
```bash
# Check logs
docker-compose logs sqlserver

# Common fix: increase Docker memory to 4GB
# Docker Desktop > Settings > Resources > Memory: 4GB
```

#### Backend can't connect to database
```bash
# Check backend logs
docker-compose logs backend

# Restart services
docker-compose restart
```

#### Port already in use
```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 PID  # macOS/Linux
taskkill /PID PID /F  # Windows

# Or change port in docker-compose.yml
```

### Backend Issues

#### "ModuleNotFoundError: No module named 'flask'"
```bash
cd backend
pip install -r requirements.txt --force-reinstall
```

#### "ODBC Driver not found"
```bash
# Install ODBC driver
# macOS:
brew install unixodbc

# Ubuntu/Debian:
sudo apt-get install unixodbc-dev

# Windows:
Download from https://learn.microsoft.com/sql/connect/odbc/download-odbc-driver-for-sql-server
```

#### "SQL Server connection refused"
1. Verify SQL Server is running
2. Check credentials in `.env`
3. Ensure TCP/IP is enabled in SQL Server Configuration Manager
4. Try: `telnet localhost 1433`

### Frontend Issues

#### "Cannot find module '@/lib/api'"
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

#### API calls return 401
- Check if backend is running: http://localhost:5000/api/admin/health
- Verify `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
- Clear browser cookies and try again

#### WebSocket connection fails
- Check backend logs for Socket.IO errors
- Verify `NEXT_PUBLIC_WS_URL` in `.env.local`
- Ensure backend is running

### Email Issues

#### Verification code not sending
1. Check backend logs: `docker-compose logs backend`
2. Verify Gmail credentials in `.env`
3. Check if 2-Step Verification is enabled
4. Use correct 16-character app password (not regular password)
5. Check spam folder

#### "SMTP authentication failed"
```
Solution: Use Gmail app password, not regular password
1. Go to https://myaccount.google.com/apppasswords
2. Generate new app password
3. Update SMTP_PASS in .env
```

### Database Issues

#### "Database 'CrimeDetectDB' does not exist"
- Backend should create it automatically on first run
- Check backend logs for creation messages
- Manually create: connect to SQL Server and run:
  ```sql
  CREATE DATABASE CrimeDetectDB;
  ```

#### Tables not created
- Verify backend has permissions to create tables
- Check backend logs for SQLAlchemy create_all output
- Manually create tables from SQL Server Management Studio

---

## Development Tips

### Access SQL Server Database

**Using SQL Server Management Studio:**
1. Download from: https://learn.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms
2. Connect to: `localhost, 1433`
3. Username: `sa`
4. Password: Your SQL password

**Using Azure Data Studio (Free):**
1. Download from: https://learn.microsoft.com/sql/azure-data-studio/download-azure-data-studio
2. Connect to: `localhost:1433`

### Useful Commands

```bash
# View database files
docker-compose exec sqlserver ls /var/opt/mssql/data

# Stop all services
docker-compose down

# Remove all data (fresh start)
docker-compose down -v

# Rebuild images
docker-compose build --no-cache

# View real-time logs
docker-compose logs -f

# Execute command in running container
docker-compose exec backend python -c "print('test')"
```

### Environment Variables Reference

**Backend (.env)**
- `SQLSERVER_*` - Database connection
- `SECRET_KEY` - Session encryption key
- `JWT_SECRET` - JWT token encryption
- `SMTP_*` - Email configuration
- `SOCKETIO_ASYNC_MODE` - WebSocket mode

**Frontend (.env.local)**
- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL
- `NEXT_PUBLIC_WS_URL` - WebSocket URL

---

## Next Steps

1. **Customize** the system for your needs
2. **Add real camera streams** (RTSP, HLS, WebRTC)
3. **Integrate AI detection** for incident types
4. **Set up SMS alerts** with Twilio
5. **Deploy to production** (Vercel + AWS/Azure)
6. **Configure SSL/HTTPS** for security

---

## Getting Help

1. Check the main [README.md](./README.md)
2. Review [API documentation](./README.md#api-endpoints)
3. Check error logs: `docker-compose logs`
4. Open an issue on GitHub

**Congratulations! Your Crime Detection System is running! 🎉**
