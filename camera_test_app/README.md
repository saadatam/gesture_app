# Raspberry Pi 5 Camera App

A Python application that uses the Raspberry Pi 5 camera to take multiple pictures with timestamps.

## Features

- 📸 Takes 5 pictures automatically
- ⏱️ Configurable delay between pictures (default: 2 seconds)
- 📅 Timestamped filenames
- 📁 Organized output directory
- 🔧 Proper camera resource management
- 📊 Progress feedback and summary

## Prerequisites

1. **Raspberry Pi 5** with camera module connected
2. **Raspberry Pi OS** (or compatible Linux distribution)
3. **Python 3.7+**
4. **Camera enabled** in Raspberry Pi configuration

## Installation

### 1. Enable Camera Interface

First, enable the camera interface:

```bash
sudo raspi-config
```

Navigate to: `Interface Options` → `Camera` → `Enable`

### 2. Install Dependencies

```bash
# Update package list
sudo apt update

# Install system dependencies
sudo apt install -y python3-picamera2 python3-pip

# Install Python dependencies
pip3 install -r requirements.txt
```

### 3. Verify Camera

Test if your camera is working:

```bash
# Check if camera is detected
vcgencmd get_camera

# Should return: supported=1 detected=1
```

## Usage

### Basic Usage

```bash
python3 camera_app.py
```

### What it does:

1. 🔧 Sets up the camera
2. 📁 Creates `captured_images` directory
3. 📸 Takes 5 pictures with 2-second delays
4. 📅 Saves images with timestamps
5. 📊 Shows summary of captured images
6. 🔒 Cleans up camera resources

### Output

Images are saved in the `captured_images/` directory with names like:
- `picture_1_20241201_143022.jpg`
- `picture_2_20241201_143024.jpg`
- etc.

## Customization

You can modify the app by editing `camera_app.py`:

- **Number of pictures**: Change `self.total_pictures = 5`
- **Delay between pictures**: Change `delay_seconds=2` in `take_multiple_pictures()`
- **Output directory**: Change `self.output_dir = "captured_images"`

## Troubleshooting

### Camera not detected
```bash
# Check camera status
vcgencmd get_camera

# If not detected, try:
sudo reboot
```

### Permission errors
```bash
# Make sure you have camera permissions
sudo usermod -a -G video $USER
# Then log out and back in
```

### Import errors
```bash
# Reinstall picamera2
sudo apt install --reinstall python3-picamera2
```

## File Structure

```
camera-app/
├── camera_app.py          # Main application
├── requirements.txt       # Python dependencies
├── README.md             # This file
└── captured_images/      # Output directory (created automatically)
    ├── picture_1_*.jpg
    ├── picture_2_*.jpg
    └── ...
```

## Safety Notes

- ⚠️ The camera LED will light up when taking pictures
- 🔒 Camera resources are automatically cleaned up
- 🛑 Use Ctrl+C to stop the app safely
- 📸 Images are saved as JPEG format

## License

This project is open source and available under the MIT License. 