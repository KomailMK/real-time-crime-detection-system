# 🚀 Crime Detection System - Setup & Run Instructions

## Choose Your Setup Method

### Option 1️⃣: Docker (Easiest - 1 Command) ⭐ RECOMMENDED

```bash
docker-compose up
```

**That's it!** Everything starts automatically:
- ✅ MySQL database
- ✅ Flask backend
- ✅ Next.js frontend

**Then open:** http://localhost:3000

---

### Option 2️⃣: Manual Setup (3 Terminals)

#### Terminal 1: MySQL Setup
```bash
# Linux/macOS: Start MySQL
mysql -u root -p

# Then run these SQL commands:
CREATE DATABASE crime_detect_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'crimedetect'@'localhost' IDENTIFIED BY 'crimedetect123';
GRANT ALL PRIVILEGES ON crime_detect_db.* TO 'crimedetect'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Terminal 2: Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials
pip install -r requirements.txt
python app.py
```

#### Terminal 3: Frontend
```bash
npm install
npm run dev
```

**Then open:** http://localhost:3000

---

## What Changed from Original

### ✅ Database: SQL Server → MySQL
- **Why?** Better compatibility with Linux/macOS
- **Changed files:** 5 backend files updated
- **Impact:** Faster, easier to set up

### ✅ UI: Completely Redesigned
- **Color scheme:** Modern purple/blue palette
- **Sidebar:** Dark professional theme
- **Buttons:** Gradient modern design
- **Overall:** Much more aesthetic and professional

### ✅ Documentation: New Guides Added
- `QUICK_START.md` - Fast reference
- `MYSQL_SETUP_GUIDE.md` - Detailed guide
- `HOW_TO_RUN.md` - Complete instructions
- `CHANGES_SUMMARY.md` - All changes explained

---

## 📋 System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Python | 3.11 | 3.11+ |
| Node.js | 18 | 18+ |
| MySQL | 8.0 | 8.0+ |
| RAM | 2GB | 4GB+ |
| Disk | 500MB | 2GB+ |

---

## 🎯 First Time Steps (After Running)

1. **Open browser:** http://localhost:3000
2. **Click "Sign Up"** tab
3. **Fill in your details:**
   - Name: John Doe
   - Email: john@example.com
   - Phone: +1234567890
   - Address: 123 Main St
   - Type: House

4. **Click "Create Account"**
5. **Get verification code** (check backend terminal in dev mode)
6. **Enter code and verify**
7. **Dashboard loads** - You're in! 🎉

---

## 📚 Documentation Files

### Quick Reference
| File | Best For |
|------|----------|
| **QUICK_START.md** | ⚡ Fast setup in 5 min |
| **HOW_TO_RUN.md** | 📖 Step-by-step guide |
| **MYSQL_SETUP_GUIDE.md** | 🔧 Detailed MySQL setup |
| **CHANGES_SUMMARY.md** | 📝 What changed from v1 |
| **SETUP_INSTRUCTIONS.md** | 👈 This file |

---

## 🆘 Quick Troubleshooting

### "Connection refused"
```bash
# Check MySQL is running
mysqladmin -u root -p ping
```

### "Port already in use"
```bash
# Kill the process
# macOS/Linux: lsof -ti:3000 | xargs kill -9
# Windows: netstat -ano | findstr :3000
```

### "Can't find npm"
```bash
# Restart terminal and check
node --version
npm --version
```

### "Backend won't start"
```bash
pip install --upgrade -r requirements.txt
```

**For more issues, see HOW_TO_RUN.md troubleshooting section**

---

## ✨ Key Features

### Security
- ✅ Passwordless email verification
- ✅ SQL injection prevention
- ✅ CSRF protection
- ✅ CORS security

### Performance
- ✅ MySQL 8.0 optimized
- ✅ UTF-8 MB4 support
- ✅ Connection pooling
- ✅ Caching enabled

### UI/UX
- ✅ Modern gradient design
- ✅ Dark professional theme
- ✅ Fully responsive
- ✅ Smooth animations

### Functionality
- ✅ Real-time camera monitoring
- ✅ Incident detection & tracking
- ✅ Alert management
- ✅ User profiles
- ✅ WebSocket updates

---

## 🚀 Starting Fresh Each Day

```bash
# Terminal 1: Backend
cd backend && python app.py

# Terminal 2: Frontend  
npm run dev

# Then open http://localhost:3000
```

---

## 📞 Need More Help?

1. **Quick setup?** → Read `QUICK_START.md`
2. **Step-by-step?** → Read `HOW_TO_RUN.md`
3. **MySQL issues?** → Read `MYSQL_SETUP_GUIDE.md`
4. **What changed?** → Read `CHANGES_SUMMARY.md`

---

## 🎓 Architecture

```
Frontend (Next.js + React)
        ↓
Backend (Flask + Python)
        ↓
Database (MySQL 8.0)
```

**All communication via REST API + WebSockets**

---

## 📊 Database Schema

**Main Tables:**
- `users` - User accounts
- `cameras` - Camera configurations
- `incidents` - Detected events
- `alerts` - Notifications
- `verification_tokens` - Email codes

**All with:** UTF-8 support, timestamps, proper indexes

---

## ✅ Verification Checklist

After setup, verify everything works:

```bash
# ✓ Check MySQL
mysql -u root -p -e "SELECT 1;"

# ✓ Check Backend
curl http://localhost:5000

# ✓ Check Frontend
# Open http://localhost:3000 in browser

# ✓ Check Database
mysql -u root -p crime_detect_db -e "SHOW TABLES;"
```

---

## 🎉 You're All Set!

**Next steps:**
1. Create an account
2. Add your first camera
3. Monitor the dashboard
4. Check incidents
5. Manage alerts

---

## 📝 Environment Variables

### Backend (.env)
```
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DB=crime_detect_db
SECRET_KEY=your-key
JWT_SECRET=your-jwt-key
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_WS_URL=ws://localhost:5000/socket.io
```

---

## 🔄 What's Different

| Aspect | Before | After |
|--------|--------|-------|
| Database | SQL Server | MySQL ✅ |
| UI Colors | Basic | Modern Purple/Blue ✅ |
| Sidebar | Light Gray | Dark Professional ✅ |
| Design | Plain | Aesthetic Gradients ✅ |
| Setup | Complex | Simple Docker ✅ |

---

## 📞 Support Links

- Python: https://python.org
- Node.js: https://nodejs.org
- MySQL: https://mysql.com
- Docker: https://docker.com

---

**That's all! Happy monitoring! 🎥📹**

---

## 🚦 Status Check

- ✅ Backend: Python + Flask
- ✅ Frontend: Next.js + React
- ✅ Database: MySQL 8.0
- ✅ Auth: Email verification
- ✅ UI: Modern & aesthetic
- ✅ Docs: Complete & clear
- ✅ Ready: For production

**Status: Ready to Use** 🚀
