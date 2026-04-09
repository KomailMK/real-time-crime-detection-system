# 🖥️ Command Reference - Crime Detection System

Quick reference for all commands you'll need to run the application.

---

## 🐳 Docker Commands (Recommended)

### Start Everything
```bash
docker-compose up
```
Starts all services: SQL Server, Flask Backend, Next.js Frontend

### Start in Background
```bash
docker-compose up -d
```
Run services in the background

### Stop Everything
```bash
docker-compose down
```
Stops all running services

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose sqlserver

# Follow logs in real-time
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail 100
```

### Check Service Status
```bash
docker-compose ps
```
Shows running status of all services

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Rebuild Images
```bash
docker-compose build --no-cache
```
Rebuilds Docker images (after code changes)

### Remove Everything (Fresh Start)
```bash
docker-compose down -v
```
Stops and removes all containers and volumes (fresh database)

### Execute Command in Container
```bash
docker-compose exec backend python -c "print('test')"
docker-compose exec sqlserver sqlcmd -S localhost -U sa -P YourPassword123!
```

---

## 🔧 Backend Commands (Manual Setup)

### Create Virtual Environment
```bash
cd backend

# Create
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate
```

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Run Backend Server
```bash
python app.py
```

### View Backend Logs
```bash
# Windows: set log level
set FLASK_ENV=development
python app.py

# macOS/Linux: set log level
export FLASK_ENV=development
python app.py
```

### Install New Python Package
```bash
pip install package-name
pip freeze > requirements.txt  # Update requirements.txt
```

### Deactivate Virtual Environment
```bash
deactivate
```

---

## 🎨 Frontend Commands (Manual Setup)

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
Runs on http://localhost:3000

### Build for Production
```bash
npm run build
```

### Start Production Build
```bash
npm run start
```

### Check for Lint Errors
```bash
npm run lint
```

### Format Code
```bash
npm run format
```

### Clean Install (If Issues)
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 🗄️ Database Commands

### Connect to SQL Server (via Docker)
```bash
# Using sqlcmd in container
docker-compose exec sqlserver sqlcmd -S localhost -U sa -P YourPassword123!

# List databases
1> SELECT name FROM sys.databases;
2> GO

# Use specific database
1> USE CrimeDetectDB;
2> GO

# List tables
1> SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='dbo';
2> GO
```

### Connect Locally (Installed SQL Server)
```bash
sqlcmd -S localhost -U sa -P YourPassword123!
```

### Test Connection
```bash
# macOS/Linux
sqlcmd -S localhost,1433 -U sa -P YourPassword123! -Q "SELECT 1"

# Windows
sqlcmd -S localhost -U sa -P YourPassword123! -Q "SELECT 1"
```

### View Database Info
```sql
-- List all databases
SELECT name FROM sys.databases;

-- Use specific database
USE CrimeDetectDB;

-- List all tables
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='dbo';

-- Count rows in table
SELECT COUNT(*) FROM users;

-- View table structure
sp_help users;

-- Backup database
BACKUP DATABASE CrimeDetectDB TO DISK = '/var/opt/mssql/backup/CrimeDetectDB.bak';
```

---

## 📋 Git Commands

### Clone Repository
```bash
git clone https://github.com/yourusername/crime-detection.git
cd crime-detection
```

### Check Status
```bash
git status
```

### Add and Commit Changes
```bash
git add .
git commit -m "Your message"
```

### Push to GitHub
```bash
git push origin main
```

### Pull Latest Changes
```bash
git pull origin main
```

---

## 📝 Environment Setup Commands

### Copy Environment Templates
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp .env.example .env.local
```

### Edit Environment Files
```bash
# Backend (.env)
nano backend/.env
# or
code backend/.env  # VS Code

# Frontend (.env.local)
nano .env.local
# or
code .env.local  # VS Code
```

---

## 🧪 Testing Commands

### Test Backend API
```bash
# Health check
curl http://localhost:5000/api/admin/health

# Request signup code
curl -X POST http://localhost:5000/api/auth/request-signup-code \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "property_type": "House"
  }'

# Get cameras
curl -X GET http://localhost:5000/api/cameras \
  -H "Cookie: session=YOUR_SESSION_COOKIE"

# Add camera
curl -X POST http://localhost:5000/api/cameras \
  -H "Content-Type: application/json" \
  -H "Cookie: session=YOUR_SESSION_COOKIE" \
  -d '{
    "camera_id": "cam-001",
    "name": "Front Door",
    "stream_url": "rtsp://camera-ip:554/stream"
  }'
```

### Test Frontend
```bash
# Open in browser
http://localhost:3000

# Sign up
Email: your-email@gmail.com
Phone: 555-1234
Address: 123 Test St
Property Type: House

# Login
Email: your-email@gmail.com
```

---

## 🔍 Troubleshooting Commands

### Find Process Using Port
```bash
# macOS/Linux
lsof -i :5000  # Backend
lsof -i :3000  # Frontend
lsof -i :1433  # Database

# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :3000
netstat -ano | findstr :1433
```

### Kill Process
```bash
# macOS/Linux
kill -9 PID

# Windows
taskkill /PID PID /F
```

### Check Docker Installation
```bash
docker --version
docker-compose --version
docker ps  # List running containers
```

### Check Python Installation
```bash
python --version
pip --version
python -m venv --help
```

### Check Node Installation
```bash
node --version
npm --version
```

### Check SQL Server
```bash
# Test connection
sqlcmd -S localhost -U sa -P YourPassword123! -Q "SELECT 1"

# Docker: check if running
docker-compose ps

# Docker: check logs
docker-compose logs sqlserver
```

### View System Resources
```bash
# macOS/Linux: CPU and memory
top  # Press 'q' to quit
htop  # More detailed (if installed)

# Windows
tasklist
wmic logicaldisk get name,size,freespace
```

---

## 🚀 Deployment Commands

### Build Docker Images
```bash
docker-compose build
```

### Push to Docker Registry
```bash
docker tag crime-detect-api:latest yourusername/crime-detect-api:latest
docker push yourusername/crime-detect-api:latest
```

### Deploy to Vercel (Frontend)
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### SSH into Server (AWS EC2)
```bash
ssh -i your-key.pem ec2-user@your-instance-ip

# or
ssh -i your-key.pem ubuntu@your-instance-ip
```

### Deploy to AWS
```bash
# Push to ECR
docker tag crime-detect-api:latest AWS_ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/crime-detect-api:latest
docker push AWS_ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/crime-detect-api:latest
```

---

## 🎯 Common Command Combinations

### Full Local Setup
```bash
# Clone
git clone REPO_URL
cd crime-detection

# Backend setup
cd backend
cp .env.example .env
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt

# Frontend setup (new terminal)
cd ..
npm install
cp .env.example .env.local

# Run backend (terminal 1)
cd backend
python app.py

# Run frontend (terminal 2)
npm run dev
```

### Quick Docker Development
```bash
docker-compose up -d
docker-compose logs -f backend
# Stop with: Ctrl+C
```

### Production-Like Local Testing
```bash
docker-compose build
docker-compose up
# Access: http://localhost:3000
```

### Clean Restart
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

---

## 📚 Command Cheat Sheet

| Task | Command |
|------|---------|
| **Start all** | `docker-compose up` |
| **Stop all** | `docker-compose down` |
| **View logs** | `docker-compose logs backend` |
| **Check status** | `docker-compose ps` |
| **Install Python deps** | `pip install -r requirements.txt` |
| **Run backend** | `python app.py` |
| **Install npm deps** | `npm install` |
| **Run frontend** | `npm run dev` |
| **Test API** | `curl http://localhost:5000/api/admin/health` |
| **Open frontend** | `http://localhost:3000` |
| **Database command** | `sqlcmd -S localhost -U sa` |
| **Kill process** | `kill -9 PID` |
| **Find port** | `lsof -i :PORT` |

---

## ⚡ Quick Reference

### Three Terminals for Manual Setup
```bash
# Terminal 1: SQL Server (if not in Docker)
sqlserver startup

# Terminal 2: Backend
cd backend
source venv/bin/activate
python app.py

# Terminal 3: Frontend
npm run dev
```

### One Command with Docker
```bash
docker-compose up
```

### View Real-Time Logs
```bash
docker-compose logs -f
```

### Reset Everything
```bash
docker-compose down -v
```

---

## 📞 Common Issues & Commands

```bash
# Port already in use
lsof -i :5000
kill -9 PID

# Module not found
pip install -r requirements.txt --force-reinstall

# Docker not working
docker ps
docker-compose --version

# Clear Node cache
rm -rf node_modules package-lock.json
npm install

# Check all services
docker-compose ps
docker-compose ps -a  # Including stopped
```

---

**Use this as a reference while developing!**

For more details, see the documentation files:
- [RUN_INSTRUCTIONS.md](./RUN_INSTRUCTIONS.md)
- [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- [README.md](./README.md)
