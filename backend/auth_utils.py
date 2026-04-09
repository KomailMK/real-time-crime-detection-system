import jwt
import random
import string
import smtplib
import logging
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import Config
from models import User, VerificationToken

logger = logging.getLogger(__name__)

def generate_verification_code(length=6):
    """Generate a random verification code"""
    return ''.join(random.choices(string.digits, k=length))

def send_verification_email(email: str, code: str, purpose: str = 'signup'):
    """Send verification code via email using Gmail SMTP"""
    try:
        logger.info(f"Attempting to send verification email to {email} using SMTP: {Config.SMTP_HOST}:{Config.SMTP_PORT}")
        
        # Check if SMTP credentials are configured
        if not Config.SMTP_USER or not Config.SMTP_PASS:
            logger.error("SMTP credentials not configured. Please set SMTP_USER and SMTP_PASS environment variables.")
            return False
        
        subject = f"Your {'Sign Up' if purpose == 'signup' else 'Login'} Verification Code - NeuroVisionX"
        
        # HTML email body with better formatting
        html_body = f"""
        <html>
            <head>
                <style>
                    body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }}
                    .container {{ max-width: 600px; margin: 20px auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }}
                    .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }}
                    .content {{ padding: 30px; }}
                    .code-box {{ background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px; text-align: center; }}
                    .code {{ font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #667eea; font-family: 'Courier New', monospace; }}
                    .footer {{ background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #e9ecef; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>NeuroVisionX</h1>
                        <p>AI-Powered Vision Intelligence</p>
                    </div>
                    <div class="content">
                        <h2>Verify Your Account</h2>
                        <p>Hello,</p>
                        <p>Your verification code for {'signing up' if purpose == 'signup' else 'logging in'} is:</p>
                        <div class="code-box">
                            <div class="code">{code}</div>
                        </div>
                        <p style="color: #666; font-size: 14px;">
                            <strong>This code expires in 10 minutes.</strong><br>
                            Do not share this code with anyone.
                        </p>
                    </div>
                    <div class="footer">
                        <p>If you didn't request this code, please ignore this email.</p>
                        <p>&copy; 2024 NeuroVisionX. All rights reserved.</p>
                    </div>
                </div>
            </body>
        </html>
        """
        
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = Config.SMTP_USER
        msg['To'] = email
        
        # Attach HTML content
        msg.attach(MIMEText(html_body, 'html'))
        
        # Connect to Gmail SMTP server
        logger.info(f"Connecting to {Config.SMTP_HOST}:{Config.SMTP_PORT}")
        
        try:
            with smtplib.SMTP(Config.SMTP_HOST, Config.SMTP_PORT, timeout=Config.SMTP_TIMEOUT) as server:
                logger.info("SMTP connection established")
                
                # Start TLS encryption
                server.starttls()
                logger.info("TLS started")
                
                # Login with credentials
                logger.info(f"Logging in with user: {Config.SMTP_USER}")
                server.login(Config.SMTP_USER, Config.SMTP_PASS)
                logger.info("Login successful")
                
                # Send email
                server.send_message(msg)
                logger.info(f"Email sent successfully to {email}")
                
                return True
                
        except smtplib.SMTPAuthenticationError as e:
            logger.error(f"SMTP Authentication failed: {str(e)}. Check email and password.")
            return False
        except smtplib.SMTPException as e:
            logger.error(f"SMTP error: {str(e)}")
            return False
        except Exception as e:
            logger.error(f"Error sending email: {str(e)}")
            return False
            
    except Exception as e:
        logger.error(f"Failed to send email to {email}: {str(e)}")
        return False

def create_verification_token(db_session, email: str, purpose: str = 'signup'):
    """Create and store a verification token"""
    try:
        code = generate_verification_code()
        expires_at = datetime.utcnow() + timedelta(minutes=Config.CODE_EXPIRY_MINUTES)
        
        token = VerificationToken(
            user_email=email,
            code=code,
            expires_at=expires_at,
            purpose=purpose,
            used=0
        )
        
        db_session.add(token)
        db_session.commit()
        
        return code
    except Exception as e:
        logger.error(f"Failed to create verification token: {str(e)}")
        db_session.rollback()
        return None

def verify_code(db_session, email: str, code: str, purpose: str = 'signup'):
    """Verify a code and mark it as used"""
    try:
        token = db_session.query(VerificationToken).filter(
            VerificationToken.user_email == email,
            VerificationToken.code == code,
            VerificationToken.purpose == purpose,
            VerificationToken.used == 0
        ).first()
        
        if not token:
            return False, "Invalid code"
        
        if datetime.utcnow() > token.expires_at:
            return False, "Code expired"
        
        token.used = 1
        db_session.commit()
        
        return True, "Code verified"
    except Exception as e:
        logger.error(f"Error verifying code: {str(e)}")
        db_session.rollback()
        return False, "Verification failed"

def create_jwt_token(user_id: int):
    """Create a JWT token"""
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=7),
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, Config.JWT_SECRET, algorithm=Config.JWT_ALGORITHM)

def verify_jwt_token(token: str):
    """Verify JWT token and return user_id"""
    try:
        payload = jwt.decode(token, Config.JWT_SECRET, algorithms=[Config.JWT_ALGORITHM])
        return payload.get('user_id')
    except jwt.ExpiredSignatureError:
        logger.error("Token expired")
        return None
    except jwt.InvalidTokenError:
        logger.error("Invalid token")
        return None
