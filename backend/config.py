import os
from datetime import timedelta

class Config:
    """Base configuration"""
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # MySQL connection
    MYSQL_HOST = os.getenv('MYSQL_HOST', 'localhost')
    MYSQL_PORT = int(os.getenv('MYSQL_PORT', 3306))
    MYSQL_USER = os.getenv('MYSQL_USER', 'root')
    MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', 'admin123')
    MYSQL_DB = os.getenv('MYSQL_DB', 'crime_detect_db')
    
    # Database URL for MySQL
    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}"
        f":{MYSQL_PORT}/{MYSQL_DB}?charset=utf8mb4"
    )
    
    # Master DB URL for initial connection (to create database)
    SQLALCHEMY_MASTER_URI = (
        f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}"
        f":{MYSQL_PORT}/mysql?charset=utf8mb4"
    )
    
    # JWT & Auth
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')
    JWT_SECRET = os.getenv('JWT_SECRET', 'your-jwt-secret-change-in-production')
    JWT_ALGORITHM = 'HS256'
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Strict'
    
    # Email Configuration for Gmail
    SMTP_HOST = os.getenv('SMTP_HOST', 'smtp.gmail.com')
    SMTP_PORT = int(os.getenv('SMTP_PORT', 587))
    SMTP_USER = os.getenv('SMTP_USER', 'nabiikhalils091@gmail.com')
    SMTP_PASS = os.getenv('SMTP_PASS', 'wkci wqnl vbka nhey')
    SMTP_TIMEOUT = 10
    
    # Verification codes
    CODE_EXPIRY_MINUTES = 10
    CODE_LENGTH = 6
    
    # SocketIO
    SOCKETIO_ASYNC_MODE = os.getenv('SOCKETIO_ASYNC_MODE', 'eventlet')
