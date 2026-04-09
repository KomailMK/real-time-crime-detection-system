# Crime & Incident Detection System

A full-stack real-time crime and incident detection system with live camera monitoring, passwordless authentication, and WebSocket-based alerts.

## Features

- **Passwordless Authentication**: Email-based 6-digit code verification
- **Camera Management**: Register and monitor multiple cameras in real-time
- **Live Dashboard**: 2x2 responsive camera grid with live stream support
- **Incident Tracking**: Record and filter security events with severity levels
- **Alert System**: Real-time notifications for detected incidents
- **WebSocket Updates**: Live push notifications for new incidents and alerts
- **User Profiles**: Manage account settings and properties
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - Component library
- **Socket.IO Client** - Real-time WebSocket support

### Backend
- **Python Flask** - Web framework
- **Flask-SocketIO** - Real-time WebSocket server
- **SQLAlchemy** - ORM
- **Microsoft SQL Server** - Database

### DevOps
- **Docker & Docker Compose** - Containerization
- **Gunicorn** - Production WSGI server

## Prerequisites

### Local Development (No Docker)
- Node.js 18+ 
- Python 3.11+
- Microsoft SQL Server 2022+
- ODBC Driver 18 for SQL Server

### With Docker
- Docker & Docker Compose

## Quick Start

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/crime-detection.git
cd crime-detection
```

2. **Create environment files**

Copy `.env.example` in the `/backend` folder:
```bash
cp backend/.env.example backend/.env
```

3. **Configure environment variables**

Edit `backend/.env` and update:
- `SMTP_USER` - Your Gmail email address
- `SMTP_PASS` - Your Gmail app password
- `SECRET_KEY` - Change this to a random string
- `JWT_SECRET` - Change this to a random string

For Gmail:
1. Enable 2-Factor Authentication in your Google Account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the 16-character password in `SMTP_PASS`

4. **Start the application**
```bash
docker-compose up -d
```

This will:
- Start SQL Server on port 1433
- Start Flask API on port 5000
- Start Next.js Frontend on port 3000
- Automatically create the database and tables

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Database: localhost:1433

### Option 2: Local Development

#### Backend Setup

1. **Install Python dependencies**
```bash
cd backend
pip install -r requirements.txt
```

2. **Configure SQL Server**
```bash
# SQL Server must be running on localhost:1433
# Default credentials: sa / YourPassword123!
```

3. **Create `.env` file** in `/backend`
```bash
cp .env.example .env
```

4. **Update environment variables** (same as Docker setup)

5. **Run Flask server**
```bash
python app.py
```
The server will automatically:
- Connect to SQL Server
- Create `CrimeDetectDB` if it doesn't exist
- Create all tables using SQLAlchemy
- Start on http://localhost:5000

#### Frontend Setup

1. **Install Node dependencies**
```bash
npm install
```

2. **Create `.env.local` file** in root directory
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_WS_URL=ws://localhost:5000/socket.io
```

3. **Run development server**
```bash
npm run dev
```
Access at http://localhost:3000

## Database Schema

The system automatically creates the following tables:

### users
- id, name, email, phone, address, property_type, verified, created_at
- Unique constraint on email

### verification_tokens
- id, user_email, code, expires_at, purpose, used, created_at
- For signup and login code verification (10-minute expiry)

### cameras
- id, user_id, camera_id, name, stream_url, location, status, last_seen, created_at
- Unique constraint on (user_id, camera_id)

### incidents
- id, camera_id, user_id, event_type, severity, start_time, end_time, clip_url, thumbnail_url, processed, notified, created_at

### alerts
- id, incident_id, user_id, recipient_email, method, status, payload, sent_at, created_at

## API Endpoints

### Authentication
- `POST /api/auth/request-signup-code` - Request signup verification code
- `POST /api/auth/verify-signup-code` - Verify signup code and create account
- `POST /api/auth/request-login-code` - Request login verification code
- `POST /api/auth/verify-login-code` - Verify login code and authenticate
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `POST /api/auth/logout` - Logout user

### Cameras
- `GET /api/cameras` - Get all cameras
- `POST /api/cameras` - Add new camera
- `PUT /api/cameras/:id` - Update camera
- `DELETE /api/cameras/:id` - Delete camera

### Incidents
- `GET /api/incidents` - Get incidents with filters (limit, page, camera_id, type)

### Alerts
- `GET /api/alerts` - Get alerts with pagination

### Health
- `GET /api/admin/health` - Health check endpoint

## WebSocket Events

Connect to `wss://localhost:5000/socket.io` after authentication.

### Server Events (Receive)
- `connected` - Connection established
- `new_incident` - New incident detected
- `alert_status` - Alert status changed
- `camera_status_update` - Camera status changed

### Client Events (Send)
- `connect` - Authenticate on connection
- `disconnect` - Disconnect from server

## Environment Variables

### Backend (`backend/.env`)
```
SQLSERVER_HOST=localhost
SQLSERVER_PORT=1433
SQLSERVER_USER=sa
SQLSERVER_PASSWORD=YourPassword123!
SQLSERVER_DB=CrimeDetectDB
SQLALCHEMY_DRIVER=ODBC Driver 18 for SQL Server
SECRET_KEY=your-secret-key-change-in-production
JWT_SECRET=your-jwt-secret-change-in-production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SOCKETIO_ASYNC_MODE=eventlet
FRONTEND_URL=http://localhost:3000
```

### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_WS_URL=ws://localhost:5000/socket.io
```

## File Structure

```
.
├── app/                           # Next.js App Router
│   ├── auth/page.tsx             # Authentication (signup/login)
│   ├── dashboard/page.tsx        # Main dashboard with camera grid
│   ├── incidents/page.tsx        # Incidents list and filters
│   ├── alerts/page.tsx           # Alerts history
│   ├── profile/page.tsx          # User profile management
│   └── layout.tsx                # Root layout
├── components/
│   ├── dashboard/                # Dashboard-specific components
│   │   ├── sidebar-nav.tsx
│   │   ├── camera-grid.tsx
│   │   ├── add-camera-modal.tsx
│   │   └── camera-modal.tsx
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── api.ts                    # API client utilities
│   └── context/
│       └── auth-context.tsx      # Authentication context
├── backend/                       # Flask backend
│   ├── app.py                    # Flask application and routes
│   ├── models.py                 # SQLAlchemy models
│   ├── config.py                 # Configuration
│   ├── database.py               # Database initialization
│   ├── auth_utils.py             # Authentication utilities
│   ├── requirements.txt          # Python dependencies
│   ├── .env.example              # Environment variables template
│   └── Dockerfile                # Backend Docker image
├── Dockerfile.frontend           # Frontend Docker image
├── docker-compose.yml            # Docker Compose configuration
├── .env.example                  # Root environment variables
└── README.md                      # This file
```

## Authentication Flow

### Signup
1. User provides: name, email, phone, address, property_type
2. System sends 6-digit code to email via SMTP
3. User enters code
4. Account created with `verified=true`
5. HttpOnly session cookie issued
6. Redirected to dashboard

### Login
1. User provides: email
2. System sends 6-digit code to email
3. User enters code
4. Verification successful
5. HttpOnly session cookie issued
6. Redirected to dashboard

### Security
- Session stored in HttpOnly, Secure, SameSite=Strict cookie
- JWT token for additional verification
- CSRF protection via SameSite cookie
- Verification codes expire after 10 minutes
- Rate limiting recommended (implement in production)

## Deployment

### Vercel (Frontend Only)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Backend Deployment Options

#### Heroku (Advanced Dyno)
```bash
heroku create crime-detect-api
heroku addons:create cleardb:ignite
heroku config:set SQLSERVER_HOST=your-sql-server.database.windows.net
git push heroku main
```

#### AWS EC2 + RDS
1. Create EC2 instance (Ubuntu 22.04)
2. Create RDS SQL Server instance
3. Install Python, Docker, and dependencies
4. Deploy using Docker Compose
5. Use Nginx as reverse proxy
6. Set up SSL with Let's Encrypt

#### Azure App Service
1. Create App Service (Linux)
2. Create Azure SQL Database
3. Configure deployment from GitHub
4. Set environment variables
5. Deploy

## Testing

### Test Signup Flow
```bash
curl -X POST http://localhost:5000/api/auth/request-signup-code \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "123456789",
    "property_type": "House"
  }'
```

### Test Camera Addition
```bash
curl -X POST http://localhost:5000/api/cameras \
  -H "Content-Type: application/json" \
  -H "Cookie: session=YOUR_SESSION_COOKIE" \
  -d '{
    "camera_id": "cam-001",
    "name": "Front Door",
    "stream_url": "rtsp://camera-ip:554/stream",
    "location": "Main Entrance"
  }'
```

## Troubleshooting

### Docker Issues

**SQL Server fails to start**
```bash
# Check logs
docker-compose logs sqlserver

# Increase memory for Docker
# Settings > Resources > Memory: 4GB+ recommended
```

**Backend can't connect to SQL Server**
```bash
# Verify SQL Server is healthy
docker-compose ps

# Check backend logs
docker-compose logs backend

# Manually test connection
docker-compose exec backend python -c "from database import init_database; init_database()"
```

**Frontend can't reach backend**
- Verify `NEXT_PUBLIC_API_BASE_URL` is correct
- Check CORS configuration in `app.py`
- Verify backend is running on port 5000

### Local Development Issues

**SQL Server connection refused**
- Ensure SQL Server is running
- Check credentials in `.env`
- Verify ODBC driver is installed: `pip install pyodbc`

**Python module not found**
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

**Next.js won't start**
```bash
# Clear Next.js cache
rm -rf .next node_modules
npm install
npm run dev
```

## Performance Optimization

1. **Database Indexing**: Add indexes on frequently queried columns
2. **Caching**: Implement Redis for session storage
3. **CDN**: Serve static assets from CloudFlare
4. **Image Optimization**: Use next/image for camera thumbnails
5. **API Pagination**: Implement cursor-based pagination for large datasets
6. **WebSocket Rooms**: Use rooms for user-specific updates

## Security Checklist

- [ ] Change `SECRET_KEY` and `JWT_SECRET` in production
- [ ] Use HTTPS in production
- [ ] Enable CORS only for trusted origins
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Use environment variables for sensitive data
- [ ] Enable SQL injection protection (SQLAlchemy parameterized queries)
- [ ] Implement account lockout after failed attempts
- [ ] Add 2FA for critical operations
- [ ] Regular security audits

## Monitoring

- Monitor database performance
- Set up error tracking (Sentry)
- Monitor API response times
- Track WebSocket connection health
- Monitor email delivery success rate
- Set up alerts for failed incidents

## Support

For issues or questions:
1. Check this README
2. Review API documentation
3. Check error logs
4. Open a GitHub issue

## License

MIT License

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

**Happy Monitoring! 🎥**
