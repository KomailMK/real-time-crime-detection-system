# IP Camera Integration Guide for NeuroVisionX

## Overview
This guide explains how to integrate Ethernet-connected IP CCTV cameras into NeuroVisionX for real-time monitoring and AI-powered detection.

## Camera Discovery & Auto-Detection

### Backend: `backend/camera_discovery.py` (CREATE NEW)

```python
import socket
import subprocess
import platform
import logging
from typing import List, Dict

logger = logging.getLogger(__name__)

class CameraDiscovery:
    """Discover IP cameras on the network"""
    
    COMMON_PORTS = [8000, 8001, 8080, 554]  # HTTP and RTSP ports
    COMMON_IPS = []  # Will be populated based on network scan
    
    @staticmethod
    def scan_network(network_range: str = '192.168.1.0/24') -> List[str]:
        """Scan network for active IP cameras"""
        import ipaddress
        active_ips = []
        
        for ip in ipaddress.ip_network(network_range, strict=False):
            try:
                if CameraDiscovery.is_ip_active(str(ip)):
                    active_ips.append(str(ip))
            except Exception as e:
                logger.debug(f"Error checking {ip}: {e}")
        
        return active_ips
    
    @staticmethod
    def is_ip_active(ip: str, timeout: int = 1) -> bool:
        """Check if IP is active using ping"""
        param = '-n' if platform.system().lower() == 'windows' else '-c'
        command = ['ping', param, '1', ip]
        
        try:
            result = subprocess.run(command, timeout=timeout, capture_output=True)
            return result.returncode == 0
        except:
            return False
    
    @staticmethod
    def probe_camera(ip: str) -> Dict:
        """Probe IP for camera service"""
        camera_info = {
            'ip': ip,
            'detected_cameras': []
        }
        
        for port in CameraDiscovery.COMMON_PORTS:
            try:
                # Try HTTP connection
                rtsp_url = f"rtsp://{ip}:{port}/stream"
                http_url = f"http://{ip}:{port}"
                
                camera_info['detected_cameras'].append({
                    'ip': ip,
                    'port': port,
                    'rtsp_url': rtsp_url,
                    'http_url': http_url,
                    'protocol': 'RTSP' if port == 554 else 'HTTP'
                })
            except:
                pass
        
        return camera_info
```

## Common IP Camera Protocols

### RTSP (Real Time Streaming Protocol)
- **Port:** 554
- **Format:** `rtsp://username:password@ip:port/path`
- **Example:** `rtsp://admin:12345@192.168.1.100:554/stream1`
- **Use:** Most reliable for professional cameras

### HTTP/MJPEG
- **Port:** 8000, 8001, 8080
- **Format:** `http://username:password@ip:port/path`
- **Example:** `http://admin:12345@192.168.1.100:8080/video`
- **Use:** Simpler setup, less reliable

### HLS (HTTP Live Streaming)
- **Port:** 80, 8080
- **Format:** `http://ip:port/stream.m3u8`
- **Use:** Web-based streaming

## Popular IP Camera Models & Stream URLs

### Hikvision
```
RTSP: rtsp://admin:password@192.168.1.100:554/Streaming/Channels/101
HTTP: http://admin:password@192.168.1.100/ISAPI/Streaming/channels/101/preview
```

### Dahua
```
RTSP: rtsp://admin:password@192.168.1.100:554/cam/realmonitor?channel=1&subtype=0
HTTP: http://admin:password@192.168.1.100:8080/mjpg/video.mjpg?channel=1
```

### Uniview
```
RTSP: rtsp://admin:password@192.168.1.100:554/media/video1
HTTP: http://admin:password@192.168.1.100:8080/vod/mp4:stream1
```

### Axis
```
RTSP: rtsp://admin:password@192.168.1.100/axis-media/media.amp?videocodec=h264
MJPEG: http://admin:password@192.168.1.100/axis-cgi/mjpg/video.cgi
```

## Manual Camera Setup

### 1. Find Your Camera's IP Address
```bash
# Windows
arp -a | findstr /R "\.255$"

# Linux/Mac
arp -a | grep -E "\(.+\)"

# Network scan tool
nmap -sn 192.168.1.0/24
```

### 2. Access Camera Web Interface
```
http://[camera-ip]:8080
Default credentials (usually):
- Username: admin
- Password: admin or 12345
```

### 3. Find Stream URL
Check camera settings for:
- RTSP stream address
- Main stream vs sub-stream
- Stream codec (H.264 preferred)

### 4. Test Connection
```python
import cv2

rtsp_url = "rtsp://admin:password@192.168.1.100:554/stream1"
cap = cv2.VideoCapture(rtsp_url)

if cap.isOpened():
    ret, frame = cap.read()
    cap.release()
    print("Camera accessible!")
else:
    print("Cannot access camera")
```

## Database Schema for IP Cameras

The existing `Camera` model supports IP cameras:

```python
class Camera(Base):
    __tablename__ = 'cameras'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    camera_id = Column(String(100), unique=True)  # e.g., "hikvision_192.168.1.100"
    name = Column(String(255))  # e.g., "Front Door Camera"
    stream_url = Column(String(500))  # RTSP or HTTP URL
    location = Column(String(255))  # e.g., "Front Entrance"
    status = Column(String(20))  # 'online', 'offline'
    last_seen = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
```

## API Endpoints for Camera Management

### Add Camera (Existing)
```
POST /api/cameras
{
  "name": "Front Door",
  "location": "Entrance",
  "stream_url": "rtsp://admin:pass@192.168.1.100:554/stream1"
}
```

### Get All Cameras (Existing)
```
GET /api/cameras
Response:
{
  "cameras": [
    {
      "id": 1,
      "name": "Front Door",
      "stream_url": "rtsp://...",
      "status": "online",
      "last_seen": "2024-01-20T10:30:00"
    }
  ]
}
```

### Health Check Route (NEW - CREATE)
Add to `backend/app.py`:
```python
@app.route('/api/cameras/<int:camera_id>/health', methods=['GET'])
def check_camera_health(camera_id: int):
    """Check if camera is accessible"""
    try:
        camera = db_session.query(Camera).get(camera_id)
        if not camera:
            return {'error': 'Camera not found'}, 404
        
        # Try to connect
        from frame_capture import FrameCapture
        frame = FrameCapture.capture_from_rtsp(camera.stream_url, timeout=5)
        
        is_online = frame is not None
        camera.status = 'online' if is_online else 'offline'
        camera.last_seen = datetime.utcnow() if is_online else camera.last_seen
        db_session.commit()
        
        return {'status': camera.status, 'camera_id': camera_id}
    except Exception as e:
        return {'error': str(e), 'status': 'offline'}, 500
```

## Real-Time Monitoring with WebSocket

### Frontend: Display IP Camera Stream
```tsx
// components/dashboard/ip-camera-viewer.tsx
'use client';

import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface IPCameraViewerProps {
  cameraId: number;
  cameraName: string;
  streamUrl: string;
}

export default function IPCameraViewer({ cameraId, cameraName, streamUrl }: IPCameraViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // For RTSP streams, use HLS or MJPEG
    // RTSP not directly supported in browser
    // Solution 1: Convert RTSP to HLS on backend
    // Solution 2: Use MJPEG endpoint if available
    
    if (streamUrl.includes('rtsp')) {
      // Convert to HLS
      const hlsUrl = `/api/cameras/${cameraId}/stream.m3u8`;
      // Use HLS.js or native video tag
    }
  }, [cameraId, streamUrl]);

  return (
    <Card className="overflow-hidden h-96">
      <video
        ref={videoRef}
        autoPlay
        controls
        className="w-full h-full object-cover bg-gray-900"
      />
    </Card>
  );
}
```

## RTSP to HLS Conversion (For Browser Compatibility)

### Using FFmpeg Streaming
Add to `backend/config.py`:
```python
# FFmpeg configuration for RTSP to HLS conversion
FFMPEG_PATH = os.getenv('FFMPEG_PATH', 'ffmpeg')
HLS_SEGMENT_DURATION = 2  # seconds
HLS_PLAYLIST_LENGTH = 3  # segments
```

Create: `backend/rtsp_to_hls.py`
```python
import subprocess
import os

class RTSPToHLS:
    @staticmethod
    def convert_stream(rtsp_url: str, hls_path: str):
        """Convert RTSP stream to HLS"""
        cmd = [
            'ffmpeg',
            '-rtsp_transport', 'tcp',
            '-i', rtsp_url,
            '-c:v', 'libx264',
            '-preset', 'fast',
            '-tune', 'zerolatency',
            '-hls_time', '2',
            '-hls_list_size', '3',
            hls_path
        ]
        subprocess.Popen(cmd)
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Camera offline | Check network, IP, credentials, firewall |
| Low FPS | Reduce resolution, use sub-stream |
| High latency | Use TCP instead of UDP, reduce bitrate |
| Authentication fails | Verify username/password, check auth method |
| Connection timeout | Increase timeout value, check firewall rules |

## Security Best Practices

1. **Change default passwords** on all cameras
2. **Use strong credentials** (min 12 characters)
3. **Enable HTTPS** if available
4. **Restrict access** to camera admin interfaces
5. **Use VPN** for remote access
6. **Update firmware** regularly
7. **Disable UPnP** to prevent remote exposure
8. **Use RTSP over TLS** if supported

## Performance Optimization

### Resolution Options
- Full HD: 1920x1080 (uses most bandwidth)
- HD: 1280x720 (recommended)
- VGA: 640x480 (uses least bandwidth)

### Frame Rate
- 30 FPS: Smooth but more CPU usage
- 15 FPS: Balanced
- 5 FPS: Low bandwidth, acceptable for monitoring

### Codec Selection
- H.264: Universal, good compression
- H.265: Better compression (newer cameras)
- MJPEG: Easier integration, larger files

## Next Steps

1. Identify your camera model and find the stream URL
2. Test stream access from backend using `cv2.VideoCapture()`
3. Add camera to database via API
4. Configure YOLO detection (see AI_MODEL_INTEGRATION_GUIDE.md)
5. Monitor camera health and incidents
6. Set up alerts for critical events
