from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import cv2
import numpy as np
import threading
import time
from typing import Optional
import uvicorn
from pydantic import BaseModel
from collections import deque
import socket

# Try to import Picamera2 for libcamera support
try:
    from picamera2 import Picamera2, Preview
    from picamera2.encoders import JpegEncoder
    from picamera2.outputs import FileOutput
    PICAMERA2_AVAILABLE = True
    print("[DEBUG] Picamera2 import: SUCCESS")
except ImportError:
    PICAMERA2_AVAILABLE = False
    print("[DEBUG] Picamera2 import: FAILED")


hostname = socket.gethostname()
ip_address = socket.gethostbyname(hostname)

app = FastAPI(title="Raspberry Pi Video Stream API", version="1.0.0")
# print("******ip******", ip_address)

# CORS middleware to allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", f"http://192.168.1.246:3000"],  # Next.js app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for camera management
camera = None
picam2 = None
picam2_config = None
camera_lock = threading.Lock()
is_streaming = False

# Add to global variables
fps_counter = deque(maxlen=60)  # Track last 30 frames
last_frame_time = time.time()

class CameraSettings(BaseModel):
    width: int = 640
    height: int = 480
    fps: int = 60
    quality: int = 70

def get_camera():
    """Get or create Picamera2 instance for Pi Camera"""
    global picam2, picam2_config
    if PICAMERA2_AVAILABLE:
        if picam2 is None:
            try:
                print("[DEBUG] Attempting to initialize Picamera2...")
                picam2 = Picamera2()
                
                # Optimized configuration for high FPS
                picam2_config = picam2.create_video_configuration(
                    main={"size": (640, 480), "format": "RGB888"},
                    controls={
                        "FrameDurationLimits": (16666, 16666),  # 60fps max
                        "NoiseReductionMode": 0,  # Disable noise reduction for speed
                        "AeEnable": False,  # Disable auto-exposure for speed
                        "AwbEnable": False,  # Disable auto-white-balance for speed
                    },
                    buffer_count=8,  # Increase buffer count
                    queue=True
                )
                
                print(f"[DEBUG] Configuring camera with: {picam2_config}")
                picam2.configure(picam2_config)
                picam2.start()
                print("✅ Picamera2 initialized successfully")
                
                # Test capture to verify camera is working
                try:
                    test_frame = picam2.capture_array()
                    print(f"[DEBUG] Test capture successful, frame shape: {test_frame.shape}")
                except Exception as e:
                    print(f"[DEBUG] Test capture failed: {e}")
                    picam2 = None
                    return None
                    
            except Exception as e:
                print(f"[DEBUG] Error initializing Picamera2: {e}")
                picam2 = None
        else:
            print("[DEBUG] Picamera2 already initialized.")
        return picam2
    else:
        print("[DEBUG] Picamera2 not available. Cannot use Pi Camera.")
        return None

def generate_test_frame(width: int = 640, height: int = 480):
    """Generate a test frame with timestamp"""
    frame = np.zeros((height, width, 3), dtype=np.uint8)
    
    # Create a gradient background
    for i in range(height):
        for j in range(width):
            frame[i, j] = [
                int(255 * i / height),  # Red gradient
                int(255 * j / width),   # Green gradient
                128                     # Blue constant
            ]
    
    # Add timestamp text
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    cv2.putText(frame, f"Raspberry Pi Stream - {timestamp}", 
                (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    cv2.putText(frame, "Test Pattern (No Camera)", 
                (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
    
    return frame

def generate_frames(settings: CameraSettings):
    """Generate video frames for streaming"""
    global is_streaming
    cam = get_camera()
    
    while is_streaming:
        try:
            if PICAMERA2_AVAILABLE and cam:
                frame = cam.capture_array()
                # Only resize frame if needed
                if frame.shape[1] != settings.width or frame.shape[0] != settings.height:
                    frame = cv2.resize(frame, (settings.width, settings.height))
                # Encode frame to JPEG
                encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), settings.quality]
                _, buffer = cv2.imencode('.jpg', frame, encode_param)
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
            else:
                frame = generate_test_frame(settings.width, settings.height)
                # Only resize frame if needed
                if frame.shape[1] != settings.width or frame.shape[0] != settings.height:
                    frame = cv2.resize(frame, (settings.width, settings.height))
                # Encode frame to JPEG
                encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), settings.quality]
                _, buffer = cv2.imencode('.jpg', frame, encode_param)
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
        except Exception as e:
            print(f"Error generating frame: {e}")
            frame = generate_test_frame(settings.width, settings.height)
            # Only resize frame if needed
            if frame.shape[1] != settings.width or frame.shape[0] != settings.height:
                frame = cv2.resize(frame, (settings.width, settings.height))
            # Encode frame to JPEG
            encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), settings.quality]
            _, buffer = cv2.imencode('.jpg', frame, encode_param)
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Raspberry Pi Video Stream API",
        "version": "1.0.0",
        "endpoints": {
            "stream": "/stream",
            "start_stream": "/start-stream",
            "stop_stream": "/stop-stream",
            "status": "/status"
        }
    }

@app.get("/status")
async def get_status():
    """Get camera and streaming status"""
    global picam2, is_streaming
    camera_status = "disconnected"
    if PICAMERA2_AVAILABLE and picam2:
        print("[DEBUG] Camera connected")
        camera_status = "connected"
    else:
        print("[DEBUG] Camera disconnected")
    
    # Calculate current FPS if streaming
    current_fps = 0
    if fps_counter and len(fps_counter) > 0:
        current_fps = sum(fps_counter) / len(fps_counter)
    
    return {
        "camera_status": camera_status,
        "streaming": is_streaming,
        "timestamp": time.time(),
        "fps": round(current_fps, 1) if current_fps > 0 else 60,  # Add FPS info
        "quality": 70,  # Add quality info
        "resolution": "640x480"  # Add resolution info
    }

@app.post("/start-stream")
async def start_stream(settings: CameraSettings):
    """Start video streaming"""
    global is_streaming
    
    with camera_lock:
        if is_streaming:
            raise HTTPException(status_code=400, detail="Stream already running")
        
        is_streaming = True
        print(f"🎬 Starting video stream: {settings.width}x{settings.height} @ {settings.fps}fps")
    
    return {"message": "Stream started", "settings": settings}

@app.post("/stop-stream")
async def stop_stream():
    """Stop video streaming"""
    global is_streaming
    
    with camera_lock:
        is_streaming = False
        print("⏹️  Stopping video stream")
    
    return {"message": "Stream stopped"}

@app.get("/stream")
async def video_stream():
    """Video streaming endpoint"""
    global is_streaming
    
    # Default settings
    settings = CameraSettings()
    
    # Check if stream is running
    if not is_streaming:
        raise HTTPException(status_code=400, detail="Stream not started. Call /start-stream first")
    
    return StreamingResponse(
        generate_frames(settings),
        media_type="multipart/x-mixed-replace; boundary=frame",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive"
        }
    )

@app.get("/capture")
async def capture_image():
    cam = get_camera()
    try:
        if PICAMERA2_AVAILABLE and cam:
            frame = cam.capture_array()
            # Only encode frame
            _, buffer = cv2.imencode('.jpg', frame, [int(cv2.IMWRITE_JPEG_QUALITY), 90])
            return StreamingResponse(
                iter([buffer.tobytes()]),
                media_type="image/jpeg"
            )
        else:
            frame = generate_test_frame()
            # Only encode frame
            _, buffer = cv2.imencode('.jpg', frame, [int(cv2.IMWRITE_JPEG_QUALITY), 90])
            return StreamingResponse(
                iter([buffer.tobytes()]),
                media_type="image/jpeg"
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error capturing image: {e}")

@app.get("/camera-info")
async def get_camera_info():
    """Get detailed camera information for debugging"""
    global picam2
    
    info = {
        "picamera2_available": PICAMERA2_AVAILABLE,
        "picam2_initialized": picam2 is not None,
        "camera_detected": False,
        "error": None
    }
    
    if PICAMERA2_AVAILABLE:
        try:
            if picam2 is None:
                # Try to initialize temporarily
                temp_picam = Picamera2()
                camera_info = temp_picam.camera_info
                info["camera_detected"] = True
                info["camera_info"] = camera_info
                temp_picam.close()
            else:
                camera_info = picam2.camera_info
                info["camera_detected"] = True
                info["camera_info"] = camera_info
        except Exception as e:
            info["error"] = str(e)
    
    return info

@app.get("/debug-colors")
async def debug_colors():
    """Debug endpoint to check color values"""
    cam = get_camera()
    if not PICAMERA2_AVAILABLE or not cam:
        return {"error": "Camera not available"}
    
    try:
        frame = cam.capture_array()
        
        # Get center pixel values
        center_y, center_x = frame.shape[0] // 2, frame.shape[1] // 2
        center_pixel = frame[center_y, center_x]
        
        # Get a few sample pixels
        sample_pixels = []
        for i in range(5):
            y = frame.shape[0] // 4 + i * 20
            x = frame.shape[1] // 4 + i * 20
            sample_pixels.append({
                "position": (x, y),
                "rgb_values": frame[y, x].tolist(),
                "bgr_values": cv2.cvtColor(frame[y:y+1, x:x+1], cv2.COLOR_RGB2BGR)[0, 0].tolist()
            })
        
        return {
            "frame_shape": frame.shape,
            "center_pixel_rgb": center_pixel.tolist(),
            "center_pixel_bgr": cv2.cvtColor(frame[center_y:center_y+1, center_x:center_x+1], cv2.COLOR_RGB2BGR)[0, 0].tolist(),
            "sample_pixels": sample_pixels,
            "format": "RGB888 (converted to BGR for display)"
        }
    except Exception as e:
        return {"error": str(e)}

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    global camera, is_streaming
    
    print("🔄 Shutting down...")
    is_streaming = False
    
    if camera:
        camera.release()
        print("📷 Camera released")

if __name__ == "__main__":

    print(f"API available at: http://{ip_address}:8000")

    print("🚀 Starting Raspberry Pi Video Stream API...")
    print(f"📡 API will be available at: http://{ip_address}:8000")
    print(f"📹 Stream endpoint: http://{ip_address}:8000/stream")
    print(f"📱 Frontend should connect to: http://{ip_address}:3000")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
