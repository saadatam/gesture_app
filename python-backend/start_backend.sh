#!/bin/bash

# Raspberry Pi Video Stream Backend Startup Script

echo "🚀 Starting Raspberry Pi Video Stream Backend..."
echo "================================================"

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Check if required packages are installed
echo "🔍 Checking dependencies..."

# Check OpenCV
if ! python3 -c "import cv2" &> /dev/null; then
    echo "❌ OpenCV is not installed. Installing..."
    sudo apt update
    sudo apt install -y python3-opencv
fi

# Check FastAPI
if ! python3 -c "import fastapi" &> /dev/null; then
    echo "❌ FastAPI is not installed. Installing..."
    pip3 install fastapi uvicorn
fi

# Check camera
echo "📷 Checking camera status..."
if command -v vcgencmd &> /dev/null; then
    CAMERA_STATUS=$(vcgencmd get_camera 2>/dev/null)
    echo "Camera status: $CAMERA_STATUS"
    
    if [[ $CAMERA_STATUS == *"detected=0"* ]]; then
        echo "⚠️  Camera not detected. Make sure:"
        echo "   - Camera is connected properly"
        echo "   - Camera interface is enabled in raspi-config"
        echo "   - Raspberry Pi has been rebooted"
    fi
else
    echo "⚠️  vcgencmd not available (not running on Raspberry Pi?)"
fi

# Check if port 8000 is available
if netstat -tuln | grep -q ":8000 "; then
    echo "⚠️  Port 8000 is already in use. Stopping existing process..."
    sudo pkill -f "python3.*main.py" || true
    sleep 2
fi

# Start the backend
echo "🎬 Starting FastAPI server..."
echo "📡 Backend will be available at: http://localhost:8000"
echo "📹 Stream endpoint: http://localhost:8000/stream"
echo "📱 Frontend should connect to: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo "================================================"

# Run the Python backend
python3 main.py 