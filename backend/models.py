from datetime import datetime, timedelta
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text, UniqueConstraint, Index
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    email = Column(String(255), nullable=False, unique=True)
    phone = Column(String(50))
    address = Column(String(500))
    property_type = Column(String(50))  # 'Shop', 'House', etc.
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    cameras = relationship('Camera', back_populates='user', cascade='all, delete-orphan')
    incidents = relationship('Incident', back_populates='user', cascade='all, delete-orphan')
    alerts = relationship('Alert', back_populates='user', cascade='all, delete-orphan')
    verification_tokens = relationship('VerificationToken', back_populates='user', cascade='all, delete-orphan')


class VerificationToken(Base):
    __tablename__ = 'verification_tokens'
    
    id = Column(Integer, primary_key=True)
    user_email = Column(String(255), ForeignKey('users.email'), nullable=False)
    code = Column(String(6), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    purpose = Column(String(10), default='signup')  # 'signup' or 'login'
    used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship('User', back_populates='verification_tokens')


class Camera(Base):
    __tablename__ = 'cameras'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    camera_id = Column(String(100), nullable=False)
    name = Column(String(255))
    stream_url = Column(String(500))
    location = Column(String(255))
    status = Column(String(20), default='offline')  # 'online', 'offline'
    last_seen = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship('User', back_populates='cameras')
    incidents = relationship('Incident', back_populates='camera', cascade='all, delete-orphan')
    
    __table_args__ = (
        UniqueConstraint('user_id', 'camera_id', name='ux_camera_user_cameraid'),
    )


class Incident(Base):
    __tablename__ = 'incidents'
    
    id = Column(Integer, primary_key=True)
    camera_id = Column(Integer, ForeignKey('cameras.id', ondelete='CASCADE'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    event_type = Column(String(100))  # 'intrusion', 'theft', 'vandalism', etc.
    severity = Column(String(50))  # 'low', 'medium', 'high', 'critical'
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime)
    clip_url = Column(String(500))
    thumbnail_url = Column(String(500))
    processed = Column(Boolean, default=False)
    notified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    camera = relationship('Camera', back_populates='incidents')
    user = relationship('User', back_populates='incidents')
    alerts = relationship('Alert', back_populates='incident', cascade='all, delete-orphan')


class Alert(Base):
    __tablename__ = 'alerts'
    
    id = Column(Integer, primary_key=True)
    incident_id = Column(Integer, ForeignKey('incidents.id', ondelete='CASCADE'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    recipient_email = Column(String(255), nullable=False)
    method = Column(String(20), default='email')  # 'email', 'sms'
    status = Column(String(20), default='pending')  # 'pending', 'sent', 'failed'
    payload = Column(Text)  # JSON as string
    sent_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    incident = relationship('Incident', back_populates='alerts')
    user = relationship('User', back_populates='alerts')
