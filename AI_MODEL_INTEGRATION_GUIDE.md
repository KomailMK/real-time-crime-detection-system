# AI Model Integration Guide - YOLO v8 for NeuroVisionX

## Overview
This guide explains how to integrate YOLOv8 (AI detection model) into the NeuroVisionX system for real-time object detection and incident classification.

## Architecture Overview

```
NeuroVisionX System:
├── Frontend (Next.js)
│   ├── Webcam Feed (browser-based)
│   ├── IP Camera Feeds (RTSP/HTTP)
│   └── Live Stream Display
│
├── Backend (Flask)
│   ├── Camera Management API
│   ├── Frame Capture Module (NEW)
│   ├── YOLOv8 Processing (NEW)
│   ├── Incident Detection (NEW)
│   └── Database Storage
│
└── AI Models (LOCAL)
    ├── YOLOv8 Nano (real-time detection)
    ├── YOLOv8 Small (balanced)
    └── Custom Fine-tuned Models (future)
```

## Phase 1: Frame Capture & Preprocessing

### File: `backend/frame_capture.py` (CREATE NEW)
```python
import cv2
import numpy as np
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class FrameCapture:
    """Capture frames from different camera sources"""
    
    @staticmethod
    def capture_from_rtsp(rtsp_url: str, timeout: int = 5) -> np.ndarray:
        """Capture frame from IP camera (RTSP stream)"""
        cap = cv2.VideoCapture(rtsp_url)
        cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
        
        ret, frame = cap.read()
        cap.release()
        
        if not ret:
            logger.error(f"Failed to capture from {rtsp_url}")
            return None
        
        return frame
    
    @staticmethod
    def capture_from_http(http_url: str) -> np.ndarray:
        """Capture frame from HTTP camera"""
        import requests
        response = requests.get(http_url, timeout=5)
        frame = cv2.imdecode(np.frombuffer(response.content, np.uint8), cv2.IMREAD_COLOR)
        return frame
    
    @staticmethod
    def preprocess_frame(frame: np.ndarray, width: int = 640, height: int = 480) -> np.ndarray:
        """Preprocess frame for YOLOv8"""
        frame = cv2.resize(frame, (width, height))
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        return frame
```

### Location to Create:
```
backend/
├── app.py (existing)
├── config.py (existing)
├── models.py (existing)
├── frame_capture.py (CREATE NEW)
├── ai_models.py (CREATE NEW - Phase 2)
└── incident_detector.py (CREATE NEW - Phase 2)
```

## Phase 2: YOLOv8 Model Integration

### File: `backend/ai_models.py` (CREATE NEW)
```python
from ultralytics import YOLO
import numpy as np
import logging

logger = logging.getLogger(__name__)

class YOLODetector:
    """Wrap YOLOv8 for object detection"""
    
    def __init__(self, model_name: str = 'yolov8n.pt'):
        """
        Initialize YOLOv8 model
        model_name options:
        - 'yolov8n.pt' (nano - fastest, least accurate)
        - 'yolov8s.pt' (small - balanced)
        - 'yolov8m.pt' (medium - more accurate)
        """
        logger.info(f"Loading YOLOv8 model: {model_name}")
        self.model = YOLO(model_name)
        self.model_name = model_name
    
    def detect(self, frame: np.ndarray, confidence: float = 0.5):
        """Run detection on frame"""
        results = self.model(frame, conf=confidence)
        return results
    
    def extract_detections(self, results) -> list:
        """Extract detections from results"""
        detections = []
        
        for r in results:
            boxes = r.boxes
            for box in boxes:
                detection = {
                    'class': int(box.cls),
                    'class_name': r.names[int(box.cls)],
                    'confidence': float(box.conf),
                    'bbox': box.xyxy[0].tolist(),  # [x1, y1, x2, y2]
                }
                detections.append(detection)
        
        return detections
    
    def is_person(self, detection) -> bool:
        """Check if detection is a person"""
        return detection['class_name'].lower() in ['person', 'people']
    
    def is_weapon(self, detection) -> bool:
        """Check if detection is a weapon (custom model)"""
        # This requires a custom-trained model
        return detection['class_name'].lower() in ['gun', 'knife', 'weapon']
```

### Installation Commands:
```bash
pip install ultralytics torch torchvision
```

## Phase 3: Incident Detection Logic

### File: `backend/incident_detector.py` (CREATE NEW)
```python
from ai_models import YOLODetector
from frame_capture import FrameCapture
from models import Incident, Alert
from database import db_session
from config import Config
import logging

logger = logging.getLogger(__name__)

class IncidentDetector:
    """Detect incidents based on AI model results"""
    
    def __init__(self):
        self.detector = YOLODetector('yolov8n.pt')  # Use nano for speed
        self.person_threshold = 0.5
        self.weapon_threshold = 0.7
    
    def process_camera_frame(self, camera_id: int, frame):
        """Process a single frame and detect incidents"""
        try:
            # Run detection
            results = self.detector.detect(frame)
            detections = self.detector.extract_detections(results)
            
            # Analyze detections for incidents
            incidents = self.analyze_detections(camera_id, detections)
            
            return incidents
        except Exception as e:
            logger.error(f"Error processing frame: {e}")
            return []
    
    def analyze_detections(self, camera_id: int, detections: list):
        """Analyze detections for potential incidents"""
        incidents = []
        
        # Count persons detected
        persons = [d for d in detections if self.detector.is_person(d)]
        
        # Check for weapons
        weapons = [d for d in detections if self.detector.is_weapon(d)]
        
        # Create incident if weapon detected
        if weapons:
            incident = Incident(
                camera_id=camera_id,
                event_type='weapon_detected',
                severity='critical',
            )
            db_session.add(incident)
            db_session.commit()
            incidents.append(incident)
            logger.warning(f"WEAPON DETECTED on camera {camera_id}")
        
        # Create incident for unusual person count
        elif len(persons) > 5:
            incident = Incident(
                camera_id=camera_id,
                event_type='crowd_detected',
                severity='high',
            )
            db_session.add(incident)
            db_session.commit()
            incidents.append(incident)
        
        return incidents
```

## Phase 4: Backend API Integration

### Update: `backend/app.py`

Add new route for AI detection:
```python
@app.route('/api/cameras/<int:camera_id>/detect', methods=['POST'])
def detect_incident(camera_id: int):
    """Run AI detection on camera frame"""
    try:
        camera = db_session.query(Camera).filter_by(id=camera_id).first()
        if not camera:
            return {'error': 'Camera not found'}, 404
        
        # Capture frame from camera
        if camera.stream_url.startswith('rtsp'):
            frame = FrameCapture.capture_from_rtsp(camera.stream_url)
        else:
            frame = FrameCapture.capture_from_http(camera.stream_url)
        
        # Preprocess
        frame = FrameCapture.preprocess_frame(frame)
        
        # Detect
        detector = IncidentDetector()
        incidents = detector.process_camera_frame(camera_id, frame)
        
        return {
            'status': 'success',
            'incidents': [{'id': i.id, 'type': i.event_type, 'severity': i.severity} for i in incidents]
        }
    except Exception as e:
        logger.error(f"Detection error: {e}")
        return {'error': str(e)}, 500
```

## Phase 5: Frontend WebSocket Updates

### File: `lib/context/ai-detection-context.tsx` (CREATE NEW)

Frontend context for real-time AI detection status:
```typescript
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface Detection {
  class_name: string;
  confidence: number;
  bbox: [number, number, number, number];
}

interface AIDetectionContextType {
  detections: Detection[];
  isProcessing: boolean;
  incidents: any[];
}

const AIDetectionContext = createContext<AIDetectionContextType | undefined>(undefined);

export function AIDetectionProvider({ children }: { children: React.ReactNode }) {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [incidents, setIncidents] = useState([]);

  // Listen for detection results via WebSocket or polling
  useEffect(() => {
    // Implementation for real-time updates
  }, []);

  return (
    <AIDetectionContext.Provider value={{ detections, isProcessing, incidents }}>
      {children}
    </AIDetectionContext.Provider>
  );
}

export function useAIDetection() {
  const context = useContext(AIDetectionContext);
  if (!context) {
    throw new Error('useAIDetection must be used within AIDetectionProvider');
  }
  return context;
}
```

## Installation Steps

### Step 1: Install Required Packages
```bash
cd backend
pip install ultralytics torch torchvision opencv-python numpy requests
```

### Step 2: Create New Files
- `backend/frame_capture.py` - Frame capture logic
- `backend/ai_models.py` - YOLOv8 wrapper
- `backend/incident_detector.py` - Incident detection logic
- `lib/context/ai-detection-context.tsx` - Frontend context

### Step 3: Update Files
- `backend/app.py` - Add detection routes
- `backend/config.py` - Add AI model configuration

### Step 4: Download Pre-trained Models (First Run)
YOLOv8 automatically downloads models on first use:
```python
from ultralytics import YOLO
model = YOLO('yolov8n.pt')  # Downloads automatically
```

## Configuration in `backend/config.py`

```python
# AI Model Settings
YOLO_MODEL = os.getenv('YOLO_MODEL', 'yolov8n.pt')
YOLO_CONFIDENCE = float(os.getenv('YOLO_CONFIDENCE', '0.5'))
DETECTION_INTERVAL = int(os.getenv('DETECTION_INTERVAL', '5'))  # seconds
ENABLE_AI_DETECTION = os.getenv('ENABLE_AI_DETECTION', 'True') == 'True'
```

## Hardware Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 4 cores | 8+ cores |
| RAM | 4GB | 8GB+ |
| GPU | None (CPU works) | NVIDIA CUDA 11.8+ |
| Storage | 500MB | 2GB (for models) |

## Model Performance

| Model | Speed (CPU ms) | Speed (GPU ms) | Accuracy | Size |
|-------|---|---|---|---|
| YOLOv8n (Nano) | 80 | 8 | 80% | 6.3MB |
| YOLOv8s (Small) | 150 | 15 | 86% | 22.5MB |
| YOLOv8m (Medium) | 300 | 30 | 91% | 49.7MB |

## Next Steps

1. Create `frame_capture.py` with camera frame capture logic
2. Create `ai_models.py` with YOLOv8 wrapper
3. Create `incident_detector.py` with detection logic
4. Update `app.py` with detection routes
5. Test with sample frames
6. Deploy to production

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Model too slow | Use nano model or GPU |
| Out of memory | Reduce frame size or use smaller model |
| CUDA not found | Install PyTorch with CUDA support |
| Inaccurate detections | Train custom model with your data |

## References

- YOLOv8 Docs: https://docs.ultralytics.com/
- NeuroVisionX Camera Integration: `/CAMERA_INTEGRATION.md`
- Detection Results Format: `/API_DOCUMENTATION.md`
