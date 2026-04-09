# 🚀 How to Run the Crime Detection System on Your Local Machine

## Quick Summary
This is a **complete, production-ready full-stack application** with:
- Frontend (Next.js)
- Backend (Flask API)
- Database (SQL Server)
- Real-time WebSocket updates
- Passwordless authentication

---

## Option 1: Docker (Easiest - 3 Steps) ⭐ RECOMMENDED

### Prerequisites
- Download & install **Docker Desktop**: https://www.docker.com/products/docker-desktop
- That's it! Docker includes everything else.

### Step 1: Get the Code
```bash
git clone https://github.com/yourusername/crime-detection.git
cd crime-detection
```

### Step 2: Set Up Gmail (for email verification codes)
1. Go to: https://myaccount.google.com/
2. Click **Security** → Enable **2-Step Verification**
3. Go to: https://myaccount.google.com/apppasswords
4. Select "Mail" and "Windows Computer"
5. Copy the 16-character password Google gives you

### Step 3: Configure and Run
```bash
# Copy environment template
cp backend/.env.example backend/.env

# Edit backend/.env with your Gmail info:
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-16-char-app-password
# (You can leave other values as-is)
nano backend/.env    # or use your favorite editor

# Start everything!
docker-compose up
```

**Wait 30-60 seconds for services to start...**

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Check health**: http://localhost:5000/api/admin/health

### Stop When Done
```bash
docker-compose down
```

---

## Option 2: Manual Setup (For Developers) 

### Prerequisites
- **Node.js 18+**: https://nodejs.org
- **Python 3.11+**: https://www.python.org
- **SQL Server 2022**: https://www.microsoft.com/sql-server (or use Docker)

### Part A: Database Setup

#### Option A1: Use Docker for Database Only
```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourPassword123!" \
  -p 1433:1433 \
  mcr.microsoft.com/mssql/server:2022-latest
```

#### Option A2: Install SQL Server Locally
- Windows: Download installer from https://www.microsoft.com/sql-server
- macOS: Use Docker (above)
- Linux: Use Docker (above)

**Default Credentials**: `sa` / `YourPassword123!`

### Part B: Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy and edit environment file
cp .env.example .env
nano .env  # Edit with your Gmail credentials

# Run backend
python app.py
```

**Expected output:**
```
INFO: Database initialized successfully
Running on http://0.0.0.0:5000
```

### Part C: Frontend Setup

**In a NEW terminal:**

```bash
# Go to project root
cd ..

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
# (.env.local can stay as-is for local development)

# Run frontend
npm run dev
```

**Expected output:**
```
▲ Next.js 16.0.0
- Local: http://localhost:3000
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

---

## Testing the System

### Step 1: Create Account
1. Go to http://localhost:3000
2. Click **"Sign Up"** tab
3. Fill in details:
   - **Name**: John Doe
   - **Email**: your-email@gmail.com
   - **Phone**: 555-1234
   - **Address**: 123 Test St
   - **Property Type**: House
4. Click **"Send Verification Code"**
5. **Check your email** for 6-digit code
6. Paste code and click **"Verify & Sign Up"**

### Step 2: Add a Camera
1. Click **"Add Camera"** button
2. Fill in:
   - **Camera ID**: test-cam-001
   - **Name**: Front Door
   - **Stream URL**: rtsp://camera-ip:554/stream
   - **Location**: Main Entrance
3. Click **"Add Camera"**
4. Camera appears in dashboard grid

### Step 3: Explore Features
- **Dashboard**: View camera grid, stats, recent incidents
- **Cameras**: Manage all cameras
- **Incidents**: View detected incidents with filters
- **Alerts**: Check notification history
- **Profile**: Update account settings

### Step 4: Test API (Optional)
```bash
# Check if backend is running
curl http://localhost:5000/api/admin/health

# This should return: {"status": "success", ...}
```

---

## Database Schema

The backend **automatically creates** the database and tables:

### Tables Created
- `users` - User accounts and profiles
- `verification_tokens` - Email verification codes
- `cameras` - Camera registrations
- `incidents` - Security events
- `alerts` - Notification history

**No manual setup needed!** The backend handles it all.

---

## Troubleshooting

### "docker: command not found"
**Solution**: Install Docker Desktop from https://www.docker.com/products/docker-desktop

### "Cannot connect to database"
```bash
# Make sure SQL Server is running
docker-compose ps  # Check if sqlserver is running

# Or test manually:
telnet localhost 1433
```

### "Email code not sending"
1. Check backend logs: `docker-compose logs backend`
2. Verify Gmail credentials in `backend/.env`
3. Use correct 16-char app password (not regular password)
4. Check spam folder

### "Port 5000 already in use"
```bash
# Find what's using it
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill it
kill -9 PID  # macOS/Linux
taskkill /PID PID /F  # Windows
```

### "npm install fails"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Python dependencies fail"
```bash
pip install -r requirements.txt --force-reinstall
```

---

## Project Structure

```
crime-detection/
├── app/                          # Next.js frontend
│   ├── auth/page.tsx            # Login/Signup
│   ├── dashboard/page.tsx       # Main dashboard
│   ├── incidents/page.tsx       # Incidents list
│   ├── alerts/page.tsx          # Alerts history
│   ├── cameras/page.tsx         # Camera management
│   └── profile/page.tsx         # User settings
│
├── backend/                      # Flask API
│   ├── app.py                   # Main application
│   ├── models.py                # Database models
│   ├── database.py              # DB initialization
│   ├── auth_utils.py            # Authentication
│   └── requirements.txt         # Dependencies
│
├── docker-compose.yml           # Docker setup
├── README.md                    # Full documentation
├── SETUP_GUIDE.md              # Detailed setup
└── RUN_INSTRUCTIONS.md         # This file
```

---

## Key Features

✅ **Passwordless Authentication** - No passwords needed
✅ **Live Camera Grid** - 2x2 responsive design
✅ **Real-time Updates** - WebSocket notifications
✅ **Incident Tracking** - Record and filter events
✅ **Alert Management** - Notification history
✅ **User Profiles** - Account management
✅ **Auto Database Setup** - No SQL knowledge needed
✅ **Docker Ready** - One-command deployment
✅ **Production Ready** - Full error handling and logging

---

## What's Running

### With Docker
- **SQL Server** (port 1433) - Database
- **Flask Backend** (port 5000) - REST API + WebSocket
- **Next.js Frontend** (port 3000) - Web interface

### Manually
- **SQL Server** (port 1433) - Run separately or with Docker
- **Flask Backend** (port 5000) - `python app.py`
- **Next.js Frontend** (port 3000) - `npm run dev`

---

## Common Commands

```bash
# Docker
docker-compose up              # Start all services
docker-compose down            # Stop all services
docker-compose logs backend    # View backend logs
docker-compose ps             # Check service status

# Frontend
npm install                    # Install dependencies
npm run dev                    # Start development server
npm run build                  # Create production build

# Backend
pip install -r requirements.txt  # Install Python dependencies
python app.py                    # Run backend server
source venv/bin/activate        # Activate Python environment
```

---

## Environment Variables

### Backend (`backend/.env`)
```
SQLSERVER_HOST=localhost
SQLSERVER_PORT=1433
SQLSERVER_USER=sa
SQLSERVER_PASSWORD=YourPassword123!
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
```

### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_WS_URL=ws://localhost:5000/socket.io
```

---

## Next Steps

1. ✅ **Run**: Start the application (Docker or manual)
2. 📝 **Create Account**: Use the signup flow
3. 📷 **Add Cameras**: Register your cameras
4. 🔍 **Monitor**: View dashboard and incidents
5. 🚀 **Deploy**: Push to Vercel + AWS for production

---

## Need Help?

- **README.md** - Full project documentation
- **SETUP_GUIDE.md** - Detailed setup instructions  
- **PROJECT_SUMMARY.md** - Project overview
- **Backend logs** - `docker-compose logs backend`
- **Frontend console** - Browser DevTools > Console

---

## Deployment

### Frontend (Vercel)
```bash
# Push to GitHub
git push origin main

# Connect to Vercel and auto-deploy
```

### Backend (AWS EC2)
```bash
# Create EC2 instance
# Install Docker
# Run docker-compose up
```

### Database (AWS RDS)
- Create RDS SQL Server instance
- Update connection string
- Deploy

---

## Quick Reference

| What | Command |
|------|---------|
| **Start (Docker)** | `docker-compose up` |
| **Start (Manual)** | Terminal 1: `python backend/app.py`<br>Terminal 2: `npm run dev` |
| **Stop** | `Ctrl+C` or `docker-compose down` |
| **Frontend** | http://localhost:3000 |
| **Backend** | http://localhost:5000 |
| **Check Health** | curl http://localhost:5000/api/admin/health |

---

## Success Checklist

- [ ] Docker or Python/Node installed
- [ ] Repository cloned
- [ ] `.env` files configured
- [ ] Services started
- [ ] Frontend loads (http://localhost:3000)
- [ ] Can create account
- [ ] Can add camera
- [ ] Dashboard shows camera
- [ ] Can navigate between pages

---

**You're all set! Happy monitoring! 🎥**

Questions? Check README.md or SETUP_GUIDE.md
