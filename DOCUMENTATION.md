# 📚 Documentation Index

Welcome to the Crime Detection System! Start here to navigate all documentation.

## 🚀 Quick Start (Start Here!)

### For Running the Application
**👉 Read first:** [RUN_INSTRUCTIONS.md](./RUN_INSTRUCTIONS.md)
- 3-step Docker setup
- Manual setup alternative
- Troubleshooting guide
- Testing instructions

### For Detailed Setup
**For detailed walkthrough:** [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- System requirements
- Docker installation
- Local development setup
- Environment configuration
- Service verification

---

## 📖 Main Documentation

### [README.md](./README.md)
**Complete project reference** (459 lines)
- Project overview
- Technology stack
- Database schema
- API endpoints (20+)
- WebSocket events
- File structure
- Performance optimization
- Security checklist
- Deployment strategies

**Read this for:** Understanding the full system architecture

---

## 📋 Project Information

### [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
**High-level project overview**
- What was built
- File structure
- Key features
- Technology stack
- Code statistics
- Future enhancements

**Read this for:** Quick overview of what's included

### [DOCUMENTATION.md](./DOCUMENTATION.md)
**You are here!** - Navigation guide

---

## 🛠️ Getting Started Paths

### Path 1: Quick Start (5 minutes)
1. Install Docker Desktop
2. Read [RUN_INSTRUCTIONS.md](./RUN_INSTRUCTIONS.md) - "Option 1: Docker"
3. Run `docker-compose up`
4. Go to http://localhost:3000
5. Create account and test

### Path 2: Complete Setup (20 minutes)
1. Read [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. Follow step-by-step instructions
3. Configure environment variables
4. Start services
5. Test the application

### Path 3: Manual Development (30 minutes)
1. Install prerequisites (Node.js, Python, SQL Server)
2. Follow [SETUP_GUIDE.md](./SETUP_GUIDE.md) - "Manual Local Setup"
3. Set up backend separately
4. Set up frontend separately
5. Run both simultaneously

---

## 📌 Reference Guides

### Feature Documentation

#### Authentication
- Located in: `app/auth/page.tsx`
- Backend: `backend/auth_utils.py`
- Flow: Email → Code → Account Creation/Login
- See: [README.md#authentication-flow](./README.md#authentication-flow)

#### Dashboard
- Located in: `app/dashboard/page.tsx`
- Components: Camera grid, stats, recent incidents
- Real-time: WebSocket for live updates

#### Camera Management
- Located in: `app/cameras/page.tsx`
- Components: Add, edit, delete cameras
- Stream support: RTSP, HLS, HTTP

#### Incidents
- Located in: `app/incidents/page.tsx`
- Features: Filter by severity, event type, date range
- Display: Table view with timestamps

#### Alerts
- Located in: `app/alerts/page.tsx`
- Features: View notification history
- Actions: Resend failed alerts

#### User Profile
- Located in: `app/profile/page.tsx`
- Features: Edit profile, delete account
- Fields: Name, email, phone, address, property type

---

## 🔌 API Reference

### Authentication Endpoints
```
POST   /api/auth/request-signup-code
POST   /api/auth/verify-signup-code
POST   /api/auth/request-login-code
POST   /api/auth/verify-login-code
GET    /api/users/me
PUT    /api/users/me
POST   /api/auth/logout
```

### Camera Endpoints
```
GET    /api/cameras
POST   /api/cameras
PUT    /api/cameras/:id
DELETE /api/cameras/:id
```

### Incident Endpoints
```
GET    /api/incidents (with filters)
```

### Alert Endpoints
```
GET    /api/alerts
```

### System Endpoints
```
GET    /api/admin/health
```

**See:** [README.md#api-endpoints](./README.md#api-endpoints)

---

## 🗄️ Database Schema

### Tables
- `users` - User accounts and profiles
- `verification_tokens` - Email verification codes
- `cameras` - Camera registrations per user
- `incidents` - Security events
- `alerts` - Notification history

**Details:** [README.md#database-schema](./README.md#database-schema)

---

## 🏗️ Project Structure

```
/
├── app/                        # Next.js frontend (8 pages)
├── backend/                    # Flask API (~800 lines)
├── components/                 # React components (4 main)
├── lib/                        # Utilities (API client, auth context)
├── docker-compose.yml          # Container orchestration
├── README.md                   # Full documentation
├── SETUP_GUIDE.md             # Setup instructions
├── RUN_INSTRUCTIONS.md        # Quick start guide
└── PROJECT_SUMMARY.md         # Project overview
```

**Detailed structure:** [PROJECT_SUMMARY.md#file-structure](./PROJECT_SUMMARY.md#file-structure)

---

## 🐳 Docker

### Quick Commands
```bash
docker-compose up              # Start all services
docker-compose down            # Stop all services
docker-compose logs backend    # View logs
docker-compose ps             # Check status
```

### What Runs
- SQL Server (1433) - Database
- Flask Backend (5000) - API + WebSocket
- Next.js Frontend (3000) - Web UI

**See:** [SETUP_GUIDE.md#quick-start-with-docker](./SETUP_GUIDE.md#quick-start-with-docker)

---

## 🔐 Security

### Implemented
- ✅ Parameterized SQL queries
- ✅ HttpOnly session cookies
- ✅ CSRF protection
- ✅ Email uniqueness at DB level
- ✅ Input validation

### Production Checklist
- 🔴 Change SECRET_KEY
- 🔴 Change JWT_SECRET
- 🔴 Enable HTTPS
- 🔴 Set up rate limiting
- 🔴 Configure CORS for allowed origins

**See:** [README.md#security-checklist](./README.md#security-checklist)

---

## 🚀 Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Connect to Vercel
3. Auto-deploys on push

### Backend (AWS EC2)
1. Create EC2 instance
2. Install Docker
3. Run `docker-compose up`

### Database (AWS RDS)
1. Create RDS SQL Server instance
2. Update connection string
3. Deploy

**See:** [README.md#deployment](./README.md#deployment)

---

## ❓ Troubleshooting

### Common Issues
1. **Docker not found** → Install Docker Desktop
2. **Port already in use** → Kill process or use different port
3. **Database connection fails** → Check credentials in `.env`
4. **Email not sending** → Verify Gmail app password
5. **Frontend won't start** → Clear `.next` and `node_modules`

**Full guide:** [SETUP_GUIDE.md#troubleshooting](./SETUP_GUIDE.md#troubleshooting)

---

## 📞 Support Resources

| Issue | Resource |
|-------|----------|
| **How to run** | [RUN_INSTRUCTIONS.md](./RUN_INSTRUCTIONS.md) |
| **Setup help** | [SETUP_GUIDE.md](./SETUP_GUIDE.md) |
| **Project overview** | [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) |
| **Full documentation** | [README.md](./README.md) |
| **API reference** | [README.md#api-endpoints](./README.md#api-endpoints) |
| **Troubleshooting** | [SETUP_GUIDE.md#troubleshooting](./SETUP_GUIDE.md#troubleshooting) |

---

## 🎯 Next Steps

### 1. Get It Running (Choose one)
- **Easiest:** Follow [RUN_INSTRUCTIONS.md](./RUN_INSTRUCTIONS.md) - Option 1 (Docker)
- **Detailed:** Follow [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Manual:** Follow [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Manual Local Setup

### 2. Test It
- Create account via email verification
- Add a camera
- Explore all pages and features

### 3. Understand It
- Review [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) for overview
- Read [README.md](./README.md) for complete details
- Review code comments for implementation details

### 4. Customize It
- Modify UI in `app/` directory
- Update API in `backend/app.py`
- Add new features to database schema

### 5. Deploy It
- Frontend to Vercel
- Backend to AWS/Azure
- Database to RDS

---

## 📚 Key Files to Know

| File | Purpose |
|------|---------|
| `app/page.tsx` | Home (redirects to auth/dashboard) |
| `app/auth/page.tsx` | Login & signup page |
| `app/dashboard/page.tsx` | Main dashboard |
| `backend/app.py` | Flask API (all endpoints) |
| `backend/models.py` | Database schema |
| `docker-compose.yml` | Container setup |
| `README.md` | Full documentation |
| `SETUP_GUIDE.md` | Setup instructions |

---

## 🎓 Learning Resources

### Frontend Tech
- Next.js: https://nextjs.org
- React: https://react.dev
- TypeScript: https://www.typescriptlang.org
- Tailwind CSS: https://tailwindcss.com
- shadcn/ui: https://ui.shadcn.com

### Backend Tech
- Flask: https://flask.palletsprojects.com
- SQLAlchemy: https://www.sqlalchemy.org
- Socket.IO: https://socket.io

### Database
- SQL Server: https://www.microsoft.com/sql-server
- T-SQL: https://learn.microsoft.com/sql/t-sql

---

## 📝 Version Info

- **Next.js**: 16.0
- **React**: 19
- **Python**: 3.11
- **Flask**: 2.3
- **SQL Server**: 2022
- **Node.js**: 18+

---

## 📄 Document Index

1. **[RUN_INSTRUCTIONS.md](./RUN_INSTRUCTIONS.md)** - 419 lines
   - Quick start guide
   - Docker & manual setup
   - Testing & troubleshooting

2. **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - 537 lines
   - Detailed setup instructions
   - System requirements
   - Environment configuration
   - Step-by-step guides

3. **[README.md](./README.md)** - 459 lines
   - Complete project documentation
   - API reference
   - Database schema
   - Deployment guide

4. **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - 312 lines
   - Project overview
   - What was built
   - Tech stack summary
   - File structure

5. **[DOCUMENTATION.md](./DOCUMENTATION.md)** - This file
   - Navigation guide
   - Quick reference

---

## 🏁 Getting Started Now

**👉 Pick one:**

- **I have 5 minutes:** Read [RUN_INSTRUCTIONS.md](./RUN_INSTRUCTIONS.md) and run Docker
- **I have 30 minutes:** Read [SETUP_GUIDE.md](./SETUP_GUIDE.md) and do manual setup  
- **I want to understand:** Read [README.md](./README.md) first, then run it

---

**Welcome to the Crime Detection System!** 🎥

Start with the documentation that fits your needs, and you'll be monitoring in no time.

Happy coding! 🚀
