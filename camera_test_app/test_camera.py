#!/usr/bin/env python3
"""
Simple camera test script for Raspberry Pi 5
"""

import subprocess
import sys

def check_camera_hardware():
    """Check if camera hardware is detected"""
    try:
        result = subprocess.run(['vcgencmd', 'get_camera'], 
                              capture_output=True, text=True, check=True)
        print(f"🔍 Camera hardware status: {result.stdout.strip()}")
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"❌ Error checking camera hardware: {e}")
        return None
    except FileNotFoundError:
        print("❌ vcgencmd not found. This script should run on Raspberry Pi.")
        return None

def check_picamera2_import():
    """Check if picamera2 can be imported"""
    try:
        import picamera2
        print("✅ picamera2 module is available")
        return True
    except ImportError as e:
        print(f"❌ picamera2 module not found: {e}")
        print("💡 Install with: sudo apt install python3-picamera2")
        return False

def test_camera_connection():
    """Test basic camera connection"""
    try:
        from picamera2 import Picamera2
        camera = Picamera2()
        print("✅ Camera object created successfully")
        
        # Try to get camera info
        info = camera.sensor_modes
        print(f"📷 Camera sensor modes available: {len(info)}")
        
        camera.close()
        return True
    except Exception as e:
        print(f"❌ Camera connection test failed: {e}")
        return False

def main():
    """Main test function"""
    print("=" * 50)
    print("📷 Raspberry Pi 5 Camera Test")
    print("=" * 50)
    
    # Check hardware
    hardware_status = check_camera_hardware()
    
    # Check Python module
    module_available = check_picamera2_import()
    
    # Test camera connection
    if module_available:
        connection_ok = test_camera_connection()
    else:
        connection_ok = False
    
    print("\n" + "=" * 50)
    print("📊 Test Results Summary:")
    print("=" * 50)
    
    if hardware_status and "detected=1" in hardware_status:
        print("✅ Camera hardware: DETECTED")
    else:
        print("❌ Camera hardware: NOT DETECTED")
    
    if module_available:
        print("✅ picamera2 module: AVAILABLE")
    else:
        print("❌ picamera2 module: NOT AVAILABLE")
    
    if connection_ok:
        print("✅ Camera connection: WORKING")
    else:
        print("❌ Camera connection: FAILED")
    
    print("\n💡 Next steps:")
    if not hardware_status or "detected=0" in hardware_status:
        print("   - Enable camera in raspi-config")
        print("   - Check camera cable connection")
        print("   - Reboot Raspberry Pi")
    
    if not module_available:
        print("   - Install picamera2: sudo apt install python3-picamera2")
    
    if not connection_ok and module_available:
        print("   - Check camera permissions")
        print("   - Try running with sudo")

if __name__ == "__main__":
    main() 