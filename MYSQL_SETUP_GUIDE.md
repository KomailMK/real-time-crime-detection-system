# MySQL Setup & Running Instructions

This guide will help you run the Crime Detection System with MySQL instead of SQL Server.

## Prerequisites

- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- MySQL 8.0+ installed on your system
- Git

## Option 1: Using Docker Compose (Easiest)

### Step 1: Install Docker
- Download Docker Desktop from https://www.docker.com/products/docker-desktop
- Install and launch Docker

### Step 2: Run with Docker Compose
```bash
# Navigate to project root
cd crime-detection-system

# Start all services (MySQL, Backend, Frontend)
docker-compose up

# The application will be available at:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:5000
```

**That's it!** Docker will automatically:
- Create and start MySQL container
- Set up the database schema
- Start the Flask backend
- Start the Next.js frontend

To stop everything:
```bash
docker-compose down
```

---

## Option 2: Manual Setup (For Development)

### Step 1: Setup MySQL Database

#### On Windows:
```bash
# Install MySQL using chocolatey
choco install mysql

# Or download from https://dev.mysql.com/downloads/mysql/

# After installation, start MySQL service
mysql -u root -p

# Create database and user
CREATE DATABASE crime_detect_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'crimedetect'@'localhost' IDENTIFIED BY 'crimedetect123';
GRANT ALL PRIVILEGES ON crime_detect_db.* TO 'crimedetect'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### On macOS (using Homebrew):
```bash
# Install MySQL
brew install mysql

# Start MySQL service
brew services start mysql

# Secure installation
mysql_secure_installation

# Create database and user
mysql -u root -p

# Inside MySQL:
CREATE DATABASE crime_detect_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'crimedetect'@'localhost' IDENTIFIED BY 'crimedetect123';
GRANT ALL PRIVILEGES ON crime_detect_db.* TO 'crimedetect'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### On Linux (Ubuntu/Debian):
```bash
# Install MySQL
sudo apt-get update
sudo apt-get install mysql-server

# Start MySQL service
sudo systemctl start mysql

# Secure installation
sudo mysql_secure_installation

# Create database and user
sudo mysql -u root -p

# Inside MySQL:
CREATE DATABASE crime_detect_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'crimedetect'@'localhost' IDENTIFIED BY 'crimedetect123';
GRANT ALL PRIVILEGES ON crime_detect_db.* TO 'crimedetect'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 2: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Create .env file from template
cp .env.example .env

# Update .env with your MySQL configuration
# MYSQL_HOST=localhost
# MYSQL_PORT=3306
# MYSQL_USER=root
# MYSQL_PASSWORD=your_password
# MYSQL_DB=crime_detect_db

# Install Python dependencies
pip install -r requirements.txt

# Run the backend
python app.py
```

The backend will automatically:
- Connect to MySQL
- Create database if it doesn't exist
- Create all tables
- Start the Flask server on http://localhost:5000

### Step 3: Setup Frontend

```bash
# Open a new terminal window
# Navigate to project root
cd path/to/crime-detection-system

# Install dependencies
npm install

# Run the development server
npm run dev
```

The frontend will start on http://localhost:3000

## Verifying the Setup

### Check MySQL is running:
```bash
# On Linux/macOS
mysql -u root -p -h localhost

# On Windows (if MySQL is in PATH)
mysql -u root -p -h localhost

# You should see the MySQL prompt: mysql>
```

### Check Backend:
- Visit http://localhost:5000/
- You should see a response from the Flask API

### Check Frontend:
- Visit http://localhost:3000
- You should see the Crime Detection System login page

## Environment Variables

### Backend (.env file)

```
# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DB=crime_detect_db

# JWT & Secret Keys
SECRET_KEY=your-secret-key-change-in-production
JWT_SECRET=your-jwt-secret-change-in-production

# Email Configuration (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# SocketIO Configuration
SOCKETIO_ASYNC_MODE=eventlet

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local file)

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_WS_URL=ws://localhost:5000/socket.io
```

## Troubleshooting

### MySQL Connection Failed
- Verify MySQL is running: `mysqladmin -u root -p ping`
- Check credentials in .env file
- Ensure database `crime_detect_db` exists: `mysql -u root -p -e "SHOW DATABASES;"`

### Backend Won't Start
```bash
# Clear Python cache
find . -type d -name __pycache__ -exec rm -r {} +

# Reinstall dependencies
pip install --upgrade -r requirements.txt

# Check Python version
python --version  # Should be 3.11+
```

### Frontend Won't Load
```bash
# Clear Next.js cache
rm -rf .next

# Clear node modules
rm -rf node_modules
npm install

# Run with verbose logging
npm run dev -- -v
```

### Ports Already in Use
If ports 3000 or 5000 are already in use:

Backend (change port):
- Edit `backend/app.py` and change `port=5000`

Frontend (Next.js will ask to use different port):
- Just press 'Y' when prompted

## Quick Start Summary

### With Docker (Recommended):
```bash
docker-compose up
# Visit http://localhost:3000
```

### Manual Setup:
```bash
# Terminal 1: Backend
cd backend
cp .env.example .env
pip install -r requirements.txt
python app.py

# Terminal 2: Frontend
npm install
npm run dev

# Visit http://localhost:3000
```

## Features

- ✅ Passwordless authentication (email verification codes)
- ✅ Real-time camera monitoring dashboard
- ✅ Incident detection and tracking
- ✅ Alert management system
- ✅ WebSocket real-time updates
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ User profiles and settings
- ✅ MySQL database with proper indexing
- ✅ Modern, aesthetic UI with design tokens

## Testing Credentials

After signup, use any email address to register:
1. Go to http://localhost:3000/auth
2. Click "Sign Up"
3. Fill in your details
4. Verification code will be logged in backend console (in development)
5. Use that code to verify

## Database Schema

The system uses these main tables:
- `users` - User accounts
- `cameras` - Camera configurations
- `incidents` - Detected incidents
- `alerts` - Alert notifications
- `verification_tokens` - Email verification codes

All tables include proper:
- Foreign keys with cascade delete
- Character set UTF-8 MB4 for international support
- Timestamps for audit trails
- Unique constraints to prevent duplicates

## API Documentation

Backend API runs on `http://localhost:5000`

Key endpoints:
- `POST /api/auth/signup` - Create account
- `POST /api/auth/verify-signup` - Verify email
- `GET /api/cameras` - List cameras
- `POST /api/cameras` - Add camera
- `GET /api/incidents` - List incidents
- `GET /api/alerts` - List alerts

WebSocket events for real-time updates available at `/socket.io`

## Performance Tips

1. **Optimize MySQL**: Set `max_connections=1000` in MySQL config
2. **Use Connection Pooling**: Backend uses SQLAlchemy connection pool
3. **Enable Caching**: Frontend uses SWR for smart caching
4. **Monitor Logs**: Check `/var/log/mysql/error.log` for database issues

## Support & Help

For issues:
1. Check the troubleshooting section above
2. View backend logs: `docker logs crime-detect-api`
3. View database logs: `docker logs crime-detect-db`
4. Check browser console for frontend errors

Enjoy monitoring! 🔒📹
