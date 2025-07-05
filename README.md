# Python Backend for Video Streaming

A FastAPI-based Python backend that provides video streaming capabilities for your Next.js Raspberry Pi 5 dashboard using OpenCV.

## Features

- 📹 **Real-time video streaming** from Raspberry Pi camera
- 🎛️ **Configurable stream settings** (resolution, FPS, quality)
- 📸 **Single image capture** functionality
- 🔄 **Test pattern fallback** when camera is unavailable
- 🌐 **CORS enabled** for frontend integration
- 📊 **Status monitoring** endpoints
- 🛡️ **Error handling** and graceful degradation

## Prerequisites

1. **Raspberry Pi 5** with camera module
2. **Python 3.8+**
3. **OpenCV** and camera drivers
4. **FastAPI** and dependencies

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

### Start the Backend Server

```bash
# Run the FastAPI server
python3 main.py
```

The server will start on `http://localhost:8000`

### API Endpoints

#### Root Endpoint
- **GET** `/` - API information and available endpoints

#### Status Endpoints
- **GET** `/status` - Get camera and streaming status
- **POST** `/start-stream` - Start video streaming
- **POST** `/stop-stream` - Stop video streaming

#### Video Endpoints
- **GET** `/stream` - Video stream (MJPEG format)
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
  -d '{"width": 640, "height": 480, "fps": 30, "quality": 80}'

# Stop streaming
curl -X POST http://localhost:8000/stop-stream

# Capture image
curl http://localhost:8000/capture -o captured_image.jpg
```

## Integration with Next.js Frontend

The backend is designed to work with the Next.js frontend. The frontend will:

1. **Connect to the backend** on `http://localhost:8000`
2. **Start/stop streams** via API calls
3. **Display video stream** using MJPEG format
4. **Show status** and handle errors

### Frontend Configuration

The Next.js app expects the backend to be running on:
- **URL**: `http://localhost:8000`
- **CORS**: Enabled for `http://localhost:3000`

## Configuration

### Camera Settings

You can customize the video stream by modifying the `CameraSettings` class:

```python
class CameraSettings(BaseModel):
    width: int = 640      # Video width
    height: int = 480     # Video height
    fps: int = 30         # Frames per second
    quality: int = 80     # JPEG quality (1-100)
```

### Camera Index

The backend uses camera index `0` by default. If you have multiple cameras, you can change this in the `get_camera()` function:

```python
camera = cv2.VideoCapture(0)  # Change 0 to 1, 2, etc.
```

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

### Project Structure

```
python-backend/
├── main.py              # FastAPI application
├── requirements.txt     # Python dependencies
├── README.md           # This file
└── test_camera.py      # Camera test script (optional)
```

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