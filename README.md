# Raspberry Pi 5 Gesture App

A comprehensive real-time video streaming and system monitoring dashboard built for Raspberry Pi 5, featuring high-performance camera streaming, system monitoring, and gesture recognition capabilities.

## 🚀 Features

### Video Streaming
- 📹 **High-performance video streaming** (60+ FPS) from Raspberry Pi camera
- 🎛️ **Configurable stream settings** (resolution, FPS, quality)
- 📸 **Single image capture** functionality
- 🔄 **Test pattern fallback** when camera is unavailable
- ⚡ **Hardware-optimized** for maximum performance

### System Monitoring
- 📊 **Real-time CPU monitoring** with per-core usage display
- 🌡️ **Temperature monitoring** with color-coded alerts
- 💾 **Memory usage tracking** with visual progress bars
- 🔄 **Auto-refresh** every 5 seconds for live updates

### Frontend Dashboard
- 🎨 **Modern Next.js interface** with responsive design
- 📱 **Mobile-friendly** layout
- 📡 **Real-time status updates**
- 🎯 **Intuitive controls** for system management

## 🛠️ Project Structure

```
python-backend/
├── main.py              # FastAPI application (camera + streaming API)
├── requirements.txt     # Python dependencies
└── test_camera.py      # Camera test script (optional)

vision-app/
└── README.md            # Frontend setup instructions

start_system.sh         # Starts backend + frontend together
```

## GPIO (Optional)
The Raspberry Pi GPIO scripts in `gpio/` (and `gpio.py` if present) are excluded from git via `.gitignore`.

## Prerequisites

1. **Raspberry Pi 5** with camera module
2. **Python 3.8+**
3. **OpenCV** and camera drivers
4. **FastAPI** and dependencies
5. **Node.js + npm** (for the Next.js frontend)

## Installation

### 1. Install System Dependencies

```bash
# Update package list
sudo apt update

# Install OpenCV and camera dependencies
sudo apt install -y python3-opencv python3-pip

# Enable camera interface (if not already done)
sudo raspi-config
# Navigate to: Interface Options → Camera → Enable
```

### 2. Install Python Dependencies

```bash
# Install required packages
pip3 install -r requirements.txt
```

### 3. Verify Camera Setup

```bash
# Check if camera is detected
vcgencmd get_camera
# Should return: supported=1 detected=1

# Test camera with OpenCV
python3 -c "import cv2; cap = cv2.VideoCapture(0); print('Camera available:', cap.isOpened()); cap.release()"
```

## Usage

### Start the Full Dashboard System

```bash
# Starts backend + frontend together
./start_system.sh
```

Expected endpoints:
- Backend: `http://<pi-ip>:8000`
- Frontend: `http://<pi-ip>:3000`
- Video stream (only after starting the stream): `http://<pi-ip>:8000/stream`

### (Optional) Start Backend Manually

```bash
cd python-backend
source ../env/bin/activate
python main.py
```

### API Endpoints

#### Root Endpoint
- **GET** `/` - API information and available endpoints

#### Status Endpoints
- **GET** `/status` - Get camera and streaming status
- **POST** `/start-stream` - Start video streaming
- **POST** `/stop-stream` - Stop video streaming
- **GET** `/camera-info` - Debug camera information
- **GET** `/debug-colors` - Debug sample pixel colors (camera capture)

#### Video Endpoints
- **GET** `/stream` - Video stream (multipart MJPEG). Requires calling `/start-stream` first.
- **GET** `/capture` - Capture single image

### Example API Usage

```bash
# Check API status
curl http://localhost:8000/

# Get camera status
curl http://localhost:8000/status

# Start streaming
curl -X POST http://localhost:8000/start-stream \
  -H "Content-Type: application/json" \
  -d '{"width": 640, "height": 480, "fps": 60, "quality": 70}'

# Stop streaming
curl -X POST http://localhost:8000/stop-stream

# Capture image
curl http://localhost:8000/capture -o captured_image.jpg
```

## Integration with Next.js Frontend

The backend is designed to work with the Next.js frontend. The frontend will:

1. **Connect to the backend** using `NEXT_PUBLIC_API_URL` (frontend default: `http://{IP_Address}:8000`)
2. **Start/stop streams** via API calls
3. **Display video stream** using MJPEG format
4. **Show status** and handle errors

### Frontend Configuration

The Next.js app expects the backend to be running on:
- **URL**: set `NEXT_PUBLIC_API_URL` in `vision-app` (see `vision-app/README.md`). Default is `http://{IP_ADDRESS}:8000`.
- **CORS**: the backend must allow your frontend origin. Update `python-backend/main.py` `allow_origins` to include `http://<pi-ip>:3000` (or `http://localhost:3000` if running locally).

## Configuration

### Camera Settings

You can customize the video stream by modifying the `CameraSettings` class:

```python
class CameraSettings(BaseModel):
    width: int = 640      # Video width
    height: int = 480     # Video height
    fps: int = 60         # Frames per second
    quality: int = 70     # JPEG quality (1-100)
```

### Camera Notes (Picamera2)
This backend uses `picamera2` when available. If Picamera2 is not available, it falls back to generating a test-pattern frame instead of failing.

## Troubleshooting

### Camera Not Detected

```bash
# Check camera hardware
vcgencmd get_camera

# If not detected:
sudo raspi-config  # Enable camera interface
sudo reboot
```

### OpenCV Import Error

```bash
# Reinstall OpenCV
sudo apt install --reinstall python3-opencv
pip3 install --upgrade opencv-python
```

### Permission Errors

```bash
# Add user to video group
sudo usermod -a -G video $USER
# Log out and back in
```

### Port Already in Use

```bash
# Check what's using port 8000
sudo netstat -tulpn | grep :8000

# Kill the process or change port in main.py
```

## Development

### Adding New Features

1. **New endpoints**: Add routes to `main.py`
2. **Camera processing**: Modify `generate_frames()` function
3. **Error handling**: Add try-catch blocks as needed

### Testing

```bash
# Test camera functionality
python3 test_camera.py

# Test API endpoints
curl http://localhost:8000/status
```

## Performance Tips

- **Lower FPS** for better performance on slower devices
- **Reduce quality** for lower bandwidth usage
- **Smaller resolution** for faster processing
- **Use hardware acceleration** if available

## Security Notes

- ⚠️ **Development server**: This is for development use
- 🔒 **Production**: Add authentication and HTTPS for production
- 🌐 **Network access**: Server binds to all interfaces (0.0.0.0)
- 📡 **CORS**: Configure allowed origins for your deployment

## License

This project is open source and available under the MIT License. 