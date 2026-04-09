import logging
import os
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, disconnect
from dotenv import load_dotenv
from config import Config
from database import init_database, get_db_session
from models import User, Camera, Incident, Alert
from auth_utils import (
    create_verification_token, verify_code, create_jwt_token, 
    verify_jwt_token, send_verification_email
)

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)
app.config['JSON_SORT_KEYS'] = False

# Initialize database
try:
    engine, SessionLocal = init_database()
    logger.info("Database initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize database: {str(e)}")
    exit(1)

# Initialize CORS
CORS(app, supports_credentials=True, origins=['http://localhost:3000', 'https://localhost:3000'])

# Initialize SocketIO
socketio = SocketIO(app, cors_allowed_origins=['http://localhost:3000', 'https://localhost:3000'])

# ============== AUTH ENDPOINTS ==============

@app.route('/api/auth/request-signup-code', methods=['POST'])
def request_signup_code():
    """Request signup verification code"""
    db = SessionLocal()
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        name = data.get('name', '').strip()
        phone = data.get('phone', '').strip()
        address = data.get('address', '').strip()
        property_type = data.get('property_type', '').strip()
        
        if not email or not name:
            return jsonify({'status': 'error', 'message': 'Email and name are required'}), 400
        
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user and existing_user.verified:
            return jsonify({'status': 'error', 'message': 'Email already registered'}), 409
        
        # Create user if not exists
        if not existing_user:
            user = User(
                name=name,
                email=email,
                phone=phone,
                address=address,
                property_type=property_type,
                verified=0
            )
            db.add(user)
            db.commit()
        else:
            # Update existing unverified user
            existing_user.name = name
            existing_user.phone = phone
            existing_user.address = address
            existing_user.property_type = property_type
            db.commit()
        
        # Create and send verification code
        code = create_verification_token(db, email, purpose='signup')
        if code:
            if send_verification_email(email, code, purpose='signup'):
                return jsonify({'status': 'success', 'message': 'Verification code sent to email'}), 200
            else:
                return jsonify({'status': 'error', 'message': 'Failed to send email'}), 500
        else:
            return jsonify({'status': 'error', 'message': 'Failed to generate code'}), 500
            
    except Exception as e:
        logger.error(f"Error in request_signup_code: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        db.close()

@app.route('/api/auth/verify-signup-code', methods=['POST'])
def verify_signup_code():
    """Verify signup code and set user as verified"""
    db = SessionLocal()
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        code = data.get('code', '').strip()
        
        if not email or not code:
            return jsonify({'status': 'error', 'message': 'Email and code are required'}), 400
        
        success, message = verify_code(db, email, code, purpose='signup')
        
        if success:
            user = db.query(User).filter(User.email == email).first()
            if user:
                user.verified = 1
                db.commit()
                
                # Create JWT and set session
                token = create_jwt_token(user.id)
                session['user_id'] = user.id
                session['token'] = token
                session.permanent = True
                
                return jsonify({
                    'status': 'success',
                    'message': 'Signup verified',
                    'user': {'id': user.id, 'email': user.email, 'name': user.name}
                }), 200
            else:
                return jsonify({'status': 'error', 'message': 'User not found'}), 404
        else:
            return jsonify({'status': 'error', 'message': message}), 400
            
    except Exception as e:
        logger.error(f"Error in verify_signup_code: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        db.close()

@app.route('/api/auth/request-login-code', methods=['POST'])
def request_login_code():
    """Request login verification code"""
    db = SessionLocal()
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        
        if not email:
            return jsonify({'status': 'error', 'message': 'Email is required'}), 400
        
        user = db.query(User).filter(User.email == email, User.verified == 1).first()
        if not user:
            return jsonify({'status': 'error', 'message': 'User not found or not verified'}), 404
        
        code = create_verification_token(db, email, purpose='login')
        if code:
            if send_verification_email(email, code, purpose='login'):
                return jsonify({'status': 'success', 'message': 'Verification code sent to email'}), 200
            else:
                return jsonify({'status': 'error', 'message': 'Failed to send email'}), 500
        else:
            return jsonify({'status': 'error', 'message': 'Failed to generate code'}), 500
            
    except Exception as e:
        logger.error(f"Error in request_login_code: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        db.close()

@app.route('/api/auth/verify-login-code', methods=['POST'])
def verify_login_code():
    """Verify login code"""
    db = SessionLocal()
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        code = data.get('code', '').strip()
        
        if not email or not code:
            return jsonify({'status': 'error', 'message': 'Email and code are required'}), 400
        
        success, message = verify_code(db, email, code, purpose='login')
        
        if success:
            user = db.query(User).filter(User.email == email).first()
            if user:
                token = create_jwt_token(user.id)
                session['user_id'] = user.id
                session['token'] = token
                session.permanent = True
                
                return jsonify({
                    'status': 'success',
                    'message': 'Login verified',
                    'user': {'id': user.id, 'email': user.email, 'name': user.name}
                }), 200
            else:
                return jsonify({'status': 'error', 'message': 'User not found'}), 404
        else:
            return jsonify({'status': 'error', 'message': message}), 400
            
    except Exception as e:
        logger.error(f"Error in verify_login_code: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        db.close()

@app.route('/api/users/me', methods=['GET'])
def get_user():
    """Get current user profile"""
    db = SessionLocal()
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'status': 'error', 'message': 'Not authenticated'}), 401
        
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return jsonify({'status': 'error', 'message': 'User not found'}), 404
        
        return jsonify({
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'phone': user.phone,
            'address': user.address,
            'property_type': user.property_type,
            'verified': bool(user.verified),
            'created_at': user.created_at.isoformat()
        }), 200
        
    except Exception as e:
        logger.error(f"Error in get_user: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        db.close()

@app.route('/api/users/me', methods=['PUT'])
def update_user():
    """Update user profile"""
    db = SessionLocal()
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'status': 'error', 'message': 'Not authenticated'}), 401
        
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return jsonify({'status': 'error', 'message': 'User not found'}), 404
        
        data = request.get_json()
        if 'name' in data:
            user.name = data['name'].strip()
        if 'phone' in data:
            user.phone = data['phone'].strip()
        if 'address' in data:
            user.address = data['address'].strip()
        if 'property_type' in data:
            user.property_type = data['property_type'].strip()
        
        db.commit()
        
        return jsonify({
            'status': 'success',
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'phone': user.phone,
                'address': user.address,
                'property_type': user.property_type
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error in update_user: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        db.close()

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """Logout user"""
    session.clear()
    return jsonify({'status': 'success', 'message': 'Logged out'}), 200

# ============== CAMERA ENDPOINTS ==============

@app.route('/api/cameras', methods=['GET'])
def get_cameras():
    """Get all cameras for user"""
    db = SessionLocal()
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'status': 'error', 'message': 'Not authenticated'}), 401
        
        cameras = db.query(Camera).filter(Camera.user_id == user_id).all()
        
        return jsonify({
            'status': 'success',
            'cameras': [{
                'id': c.id,
                'camera_id': c.camera_id,
                'name': c.name,
                'stream_url': c.stream_url,
                'location': c.location,
                'status': c.status,
                'last_seen': c.last_seen.isoformat() if c.last_seen else None,
                'created_at': c.created_at.isoformat()
            } for c in cameras]
        }), 200
        
    except Exception as e:
        logger.error(f"Error in get_cameras: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        db.close()

@app.route('/api/cameras', methods=['POST'])
def add_camera():
    """Add new camera"""
    db = SessionLocal()
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'status': 'error', 'message': 'Not authenticated'}), 401
        
        data = request.get_json()
        camera_id = data.get('camera_id', '').strip()
        name = data.get('name', '').strip()
        stream_url = data.get('stream_url', '').strip()
        location = data.get('location', '').strip()
        
        if not camera_id or not name:
            return jsonify({'status': 'error', 'message': 'camera_id and name are required'}), 400
        
        # Check if camera_id already exists for this user
        existing = db.query(Camera).filter(
            Camera.user_id == user_id,
            Camera.camera_id == camera_id
        ).first()
        
        if existing:
            return jsonify({'status': 'error', 'message': 'Camera ID already exists'}), 409
        
        camera = Camera(
            user_id=user_id,
            camera_id=camera_id,
            name=name,
            stream_url=stream_url,
            location=location,
            status='offline'
        )
        
        db.add(camera)
        db.commit()
        
        return jsonify({
            'status': 'success',
            'camera': {
                'id': camera.id,
                'camera_id': camera.camera_id,
                'name': camera.name,
                'stream_url': camera.stream_url,
                'location': camera.location,
                'status': camera.status
            }
        }), 201
        
    except Exception as e:
        logger.error(f"Error in add_camera: {str(e)}")
        db.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        db.close()

@app.route('/api/cameras/<int:camera_id>', methods=['PUT'])
def update_camera(camera_id):
    """Update camera"""
    db = SessionLocal()
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'status': 'error', 'message': 'Not authenticated'}), 401
        
        camera = db.query(Camera).filter(
            Camera.id == camera_id,
            Camera.user_id == user_id
        ).first()
        
        if not camera:
            return jsonify({'status': 'error', 'message': 'Camera not found'}), 404
        
        data = request.get_json()
        if 'name' in data:
            camera.name = data['name'].strip()
        if 'stream_url' in data:
            camera.stream_url = data['stream_url'].strip()
        if 'location' in data:
            camera.location = data['location'].strip()
        
        db.commit()
        
        return jsonify({'status': 'success', 'message': 'Camera updated'}), 200
        
    except Exception as e:
        logger.error(f"Error in update_camera: {str(e)}")
        db.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        db.close()

@app.route('/api/cameras/<int:camera_id>', methods=['DELETE'])
def delete_camera(camera_id):
    """Delete camera"""
    db = SessionLocal()
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'status': 'error', 'message': 'Not authenticated'}), 401
        
        camera = db.query(Camera).filter(
            Camera.id == camera_id,
            Camera.user_id == user_id
        ).first()
        
        if not camera:
            return jsonify({'status': 'error', 'message': 'Camera not found'}), 404
        
        db.delete(camera)
        db.commit()
        
        return jsonify({'status': 'success', 'message': 'Camera deleted'}), 200
        
    except Exception as e:
        logger.error(f"Error in delete_camera: {str(e)}")
        db.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        db.close()

# ============== INCIDENTS ENDPOINTS ==============

@app.route('/api/incidents', methods=['GET'])
def get_incidents():
    """Get incidents with optional filters"""
    db = SessionLocal()
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'status': 'error', 'message': 'Not authenticated'}), 401
        
        limit = request.args.get('limit', 20, type=int)
        page = request.args.get('page', 1, type=int)
        offset = (page - 1) * limit
        
        query = db.query(Incident).filter(Incident.user_id == user_id)
        
        # Apply filters if provided
        camera_id = request.args.get('camera_id', type=int)
        if camera_id:
            query = query.filter(Incident.camera_id == camera_id)
        
        event_type = request.args.get('type')
        if event_type:
            query = query.filter(Incident.event_type == event_type)
        
        incidents = query.order_by(Incident.created_at.desc()).offset(offset).limit(limit).all()
        
        return jsonify({
            'status': 'success',
            'incidents': [{
                'id': i.id,
                'camera_id': i.camera_id,
                'camera_name': i.camera.name if i.camera else 'Unknown',
                'event_type': i.event_type,
                'severity': i.severity,
                'start_time': i.start_time.isoformat(),
                'end_time': i.end_time.isoformat() if i.end_time else None,
                'clip_url': i.clip_url,
                'thumbnail_url': i.thumbnail_url,
                'processed': bool(i.processed),
                'notified': bool(i.notified),
                'created_at': i.created_at.isoformat()
            } for i in incidents]
        }), 200
        
    except Exception as e:
        logger.error(f"Error in get_incidents: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        db.close()

# ============== ALERTS ENDPOINTS ==============

@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    """Get alerts"""
    db = SessionLocal()
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'status': 'error', 'message': 'Not authenticated'}), 401
        
        limit = request.args.get('limit', 20, type=int)
        page = request.args.get('page', 1, type=int)
        offset = (page - 1) * limit
        
        alerts = db.query(Alert).filter(Alert.user_id == user_id)\
            .order_by(Alert.created_at.desc())\
            .offset(offset).limit(limit).all()
        
        return jsonify({
            'status': 'success',
            'alerts': [{
                'id': a.id,
                'incident_id': a.incident_id,
                'recipient_email': a.recipient_email,
                'method': a.method,
                'status': a.status,
                'sent_at': a.sent_at.isoformat() if a.sent_at else None,
                'created_at': a.created_at.isoformat()
            } for a in alerts]
        }), 200
        
    except Exception as e:
        logger.error(f"Error in get_alerts: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        db.close()

# ============== HEALTH CHECK ==============

@app.route('/api/admin/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'success',
        'message': 'Server is running',
        'database': 'connected'
    }), 200

# ============== ERROR HANDLERS ==============

@app.errorhandler(404)
def not_found(error):
    return jsonify({'status': 'error', 'message': 'Endpoint not found'}), 404

@app.errorhandler(500)
def server_error(error):
    logger.error(f"Server error: {str(error)}")
    return jsonify({'status': 'error', 'message': 'Internal server error'}), 500

# ============== SOCKETIO EVENTS ==============

@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    user_id = session.get('user_id')
    if user_id:
        join_room(f'user_{user_id}')
        logger.info(f"User {user_id} connected")
        emit('connected', {'data': f'Connected with user_id {user_id}'})
    else:
        logger.warning("Anonymous user tried to connect")
        disconnect()

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    logger.info("User disconnected")

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000, allow_unsafe_werkzeug=True)
