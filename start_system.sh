#!/bin/bash

# Raspberry Pi 5 Dashboard System Startup Script
# Starts both Python backend and Next.js frontend

echo "🚀 Starting Raspberry Pi 5 Dashboard System..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "python-backend/main.py" ] || [ ! -d "vision-app" ]; then
    print_error "Please run this script from the Gesture_app directory"
    exit 1
fi

# Check Python 3
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "Checking system dependencies..."

# Install backend dependencies from requirements.txt
print_status "Installing backend dependencies..."

# Activate virtual environment
source env/bin/activate
cd python-backend

# Upgrade pip
print_status "Upgrading pip..."
pip install --upgrade pip

# Install dependencies
if [ -f "requirements.txt" ]; then
    print_status "Installing backend dependencies from requirements.txt..."
    pip install -r requirements.txt || true
else
    print_warning "requirements.txt not found, installing base dependencies..."
    pip install fastapi uvicorn opencv-python numpy pydantic python-multipart || true
fi

# Ensure compatible numpy version for OpenCV
print_status "Ensuring compatible numpy version..."
pip install "numpy<2"

cd ..

# Check camera
print_status "Checking camera status..."
if command -v vcgencmd &> /dev/null; then
    CAMERA_STATUS=$(vcgencmd get_camera 2>/dev/null)
    print_status "Camera status: $CAMERA_STATUS"
    
    if [[ $CAMERA_STATUS == *"detected=0"* ]]; then
        print_warning "Camera not detected. Make sure:"
        echo "   - Camera is connected properly"
        echo "   - Camera interface is enabled in raspi-config"
        echo "   - Raspberry Pi has been rebooted"
    fi
else
    print_warning "vcgencmd not available (not running on Raspberry Pi?)"
fi

# Check if ports are available
print_status "Checking port availability..."

if netstat -tuln | grep -q ":8000 "; then
    print_warning "Port 8000 is already in use. Stopping existing process..."
    sudo pkill -f "python3.*main.py" || true
    sleep 2
fi

if netstat -tuln | grep -q ":3000 "; then
    print_warning "Port 3000 is already in use. Frontend may start on port 3001..."
    sudo pkill -f "next" || true
    sleep 2
fi

# Install frontend dependencies if needed
print_status "Checking frontend dependencies..."
if [ ! -d "vision-app/node_modules" ]; then
    print_status "Installing frontend dependencies..."
    cd vision-app
    npm install
    cd ..
fi

# Function to cleanup on exit
cleanup() {
    print_status "Shutting down services..."
    sudo pkill -f "python3.*main.py" || true
    sudo pkill -f "next" || true
    print_success "Services stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Kill any running backend/frontend processes
echo "🔪 Killing existing backend/frontend processes..."
pkill -f "python.*main.py"
pkill -f "uvicorn"
pkill -f "next"

sleep 2

# Performance optimizations for video streaming
echo "🚀 Optimizing system for video streaming..."

# Set CPU governor to performance
echo performance | sudo tee /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor

# Increase GPU memory split (if needed)
# Add to /boot/config.txt: gpu_mem=128

# Optimize network settings
sudo sysctl -w net.core.rmem_max=26214400
sudo sysctl -w net.core.wmem_max=26214400
sudo sysctl -w net.ipv4.tcp_rmem="4096 87380 16777216"
sudo sysctl -w net.ipv4.tcp_wmem="4096 65536 16777216"

# Start the backend
cd python-backend
# Activate virtual environment and start backend
source ../env/bin/activate
nohup python main.py > ../backend.log 2>&1 &
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
for i in {1..10}; do
    if curl -s "http://localhost:8000/status" | grep -q "camera_status"; then
        echo "✅ Backend is up!"
        break
    fi
    sleep 1
done

# Start the Next.js frontend
echo "🌐 Starting Next.js frontend..."
cd vision-app
nohup npm run dev > frontend.log 2>&1 &

echo "✅ System started!"
echo "Backend log: $(pwd)/../backend.log"
echo "Frontend log: $(pwd)/frontend.log"

echo ""
echo "================================================"
print_success "System started successfully!"
echo ""
echo "📡 Backend API: http://localhost:8000"
echo "📱 Frontend: http://localhost:3000"
echo "📹 Video Stream: http://localhost:8000/stream"
echo ""
echo "Press Ctrl+C to stop all services"
echo "================================================"

# Wait for user to stop
wait 