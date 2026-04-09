# Quick Start Guide - Crime Detection System with MySQL

## 🚀 Fastest Way: Docker (Recommended)

```bash
# Make sure Docker is running, then:
docker-compose up

# That's it! Visit http://localhost:3000
```

**What happens automatically:**
- ✅ MySQL database starts and initializes
- ✅ Flask backend starts
- ✅ Next.js frontend starts
- ✅ Tables are created automatically

---

## 📦 Manual Setup (No Docker)

### Prerequisites
- MySQL 8.0+ running locally
- Python 3.11+
- Node.js 18+

### Step 1: Setup MySQL (5 minutes)

#### Windows
```bash
# Install: https://dev.mysql.com/downloads/mysql/

# Open Command Prompt as Admin, then:
mysql -u root -p

# Paste this in MySQL:
CREATE DATABASE crime_detect_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'crimedetect'@'localhost' IDENTIFIED BY 'crimedetect123';
GRANT ALL PRIVILEGES ON crime_detect_db.* TO 'crimedetect'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### macOS
```bash
brew install mysql
mysql.server start
mysql -u root

# Paste in MySQL:
CREATE DATABASE crime_detect_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'crimedetect'@'localhost' IDENTIFIED BY 'crimedetect123';
GRANT ALL PRIVILEGES ON crime_detect_db.* TO 'crimedetect'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get install mysql-server
sudo mysql -u root

# Paste in MySQL:
CREATE DATABASE crime_detect_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'crimedetect'@'localhost' IDENTIFIED BY 'crimedetect123';
GRANT ALL PRIVILEGES ON crime_detect_db.* TO 'crimedetect'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 2: Start Backend (Terminal 1)

```bash
cd backend

# Windows
copy .env.example .env

# macOS/Linux
cp .env.example .env

# Edit .env and set:
# MYSQL_HOST=localhost
# MYSQL_PORT=3306
# MYSQL_USER=root
# MYSQL_PASSWORD=your_password
# MYSQL_DB=crime_detect_db

# Install and run
pip install -r requirements.txt
python app.py

# You should see:
# ✓ Database initialized
# ✓ Running on http://127.0.0.1:5000
```

### Step 3: Start Frontend (Terminal 2)

```bash
# From project root
npm install
npm run dev

# You should see:
# ✓ Ready in X.XXs
# ✓ Local: http://localhost:3000
```

---

## 🌐 Access the Application

| Component | URL |
|-----------|-----|
| Frontend (UI) | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| MySQL | localhost:3306 |

---

## 👤 First Time Setup

1. Go to **http://localhost:3000**
2. Click **"Sign Up"** tab
3. Fill in your details:
   - Name: Your name
   - Email: your@email.com
   - Phone: (optional)
   - Address: (optional)
   - Property Type: House/Shop/Office

4. Click **"Create Account"**
5. You'll receive a **verification code** in your email (or check backend logs)
6. Enter the code and click **"Verify & Complete Signup"**
7. Dashboard loads! 🎉

---

## 🎮 Main Features to Try

### Dashboard
- View total cameras and online status
- See critical incidents count
- Quick access to all sections

### Cameras
- Add new camera (Click "Add Camera" button)
- Monitor camera status (Online/Offline)
- View camera details and history

### Incidents
- See all detected incidents
- Filter by severity (Low/Medium/High/Critical)
- Check event types and timestamps

### Alerts
- View alert notifications
- See alert status (Pending/Sent/Failed)
- Check incident associations

### Profile
- View and update user information
- Change property details
- See account statistics

---

## 🛠️ Troubleshooting

### Backend won't start
```bash
# Check Python version (need 3.11+)
python --version

# Clear cache and reinstall
pip install --upgrade -r requirements.txt

# Check MySQL connection
mysql -u root -p -e "SELECT 1"
```

### Frontend won't load
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall and rebuild
rm -rf node_modules
npm install
npm run dev
```

### Can't connect to MySQL
```bash
# Verify MySQL is running
mysqladmin -u root -p ping

# Check if database exists
mysql -u root -p -e "SHOW DATABASES;"

# Recreate if needed
mysql -u root -p < setup.sql
```

### Ports already in use
- **3000 taken?** npm will ask to use another port, press Y
- **5000 taken?** Kill the process or edit backend port

---

## 📝 Default Credentials (for testing)

After signup, use any email for registration. No password needed - just verification code!

**Development mode:**
- Verification codes are printed to backend console
- Check terminal output for the code

**Production mode:**
- Codes sent via email (configure SMTP settings in .env)

---

## 🗂️ Project Structure

```
crime-detection-system/
├── app/                    # Next.js frontend
│   ├── auth/              # Login/Signup pages
│   ├── dashboard/         # Main dashboard
│   ├── cameras/           # Camera management
│   ├── incidents/         # Incident tracking
│   ├── alerts/            # Alert notifications
│   └── profile/           # User profile
├── components/            # React components
│   └── dashboard/         # Dashboard components
├── backend/               # Flask backend
│   ├── app.py            # Main Flask app
│   ├── models.py         # Database models
│   ├── config.py         # Configuration
│   └── auth_utils.py     # Authentication
├── docker-compose.yml     # Docker configuration
└── README.md             # Full documentation
```

---

## 🔒 Security

- ✅ Passwordless auth (no passwords to hack)
- ✅ Email verification required
- ✅ HTTPS-ready (set in production)
- ✅ CORS protection
- ✅ SQL injection prevention
- ✅ CSRF token validation

---

## 📊 Database Info

**MySQL Version:** 8.0+
**Character Set:** UTF8MB4 (supports emojis and international chars)
**Collation:** utf8mb4_unicode_ci

**Tables:**
- users (user accounts)
- cameras (camera configurations)
- incidents (detected events)
- alerts (notifications)
- verification_tokens (email codes)

---

## 💡 Tips

1. **Development:** Use Docker for hassle-free setup
2. **Testing:** Create test cameras to see dashboard features
3. **Performance:** Keep MySQL running for better speed
4. **Debugging:** Check browser console (F12) for frontend errors
5. **Logs:** Backend logs show database operations

---

## 🆘 Need Help?

1. **Backend issues?** Check `/backend/app.py` logs
2. **Database issues?** Check MySQL error log
3. **Frontend issues?** Check browser developer tools (F12)
4. **Docker issues?** Run `docker-compose logs` to see all logs

---

## ✨ What's New

- ✅ **MySQL Support:** Replaced SQL Server for better compatibility
- ✅ **Modern UI:** Updated design tokens and aesthetic improvements
- ✅ **Better Navigation:** Improved sidebar and responsive layout
- ✅ **Smooth Animations:** Enhanced user experience
- ✅ **Better Error Handling:** Clear error messages

---

**That's all! Happy monitoring! 🎥📹**

For detailed documentation, see [MYSQL_SETUP_GUIDE.md](./MYSQL_SETUP_GUIDE.md)
