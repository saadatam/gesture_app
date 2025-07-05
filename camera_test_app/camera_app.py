#!/usr/bin/env python3
"""
Raspberry Pi 5 Camera App
Takes 5 pictures using the Pi Camera
"""

import time
import os
from datetime import datetime
from picamera2 import Picamera2
from picamera2.encoders import JpegEncoder
from picamera2.outputs import FileOutput

class PiCameraApp:
    def __init__(self):
        self.camera = None
        self.pictures_taken = 0
        self.total_pictures = 5
        self.output_dir = "captured_images"
        
    def setup_camera(self):
        """Initialize the camera"""
        try:
            print("🔧 Setting up Raspberry Pi Camera...")
            self.camera = Picamera2()
            
            # Configure camera for still capture
            config = self.camera.create_still_configuration()
            self.camera.configure(config)
            
            # Start the camera
            self.camera.start()
            print("✅ Camera initialized successfully!")
            
            # Create output directory if it doesn't exist
            if not os.path.exists(self.output_dir):
                os.makedirs(self.output_dir)
                print(f"📁 Created directory: {self.output_dir}")
            
            return True
            
        except Exception as e:
            print(f"❌ Error setting up camera: {e}")
            return False
    
    def take_picture(self, picture_number):
        """Take a single picture"""
        try:
            # Generate filename with timestamp
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"{self.output_dir}/picture_{picture_number}_{timestamp}.jpg"
            
            print(f"📸 Taking picture {picture_number}/{self.total_pictures}...")
            
            # Capture the image
            self.camera.capture_file(filename)
            
            # Verify file was created
            if os.path.exists(filename):
                file_size = os.path.getsize(filename)
                print(f"✅ Picture {picture_number} saved: {filename} ({file_size} bytes)")
                self.pictures_taken += 1
                return True
            else:
                print(f"❌ Failed to save picture {picture_number}")
                return False
                
        except Exception as e:
            print(f"❌ Error taking picture {picture_number}: {e}")
            return False
    
    def take_multiple_pictures(self, delay_seconds=2):
        """Take multiple pictures with delay between each"""
        print(f"\n🎯 Starting to take {self.total_pictures} pictures...")
        print(f"⏱️  Delay between pictures: {delay_seconds} seconds")
        print("-" * 50)
        
        for i in range(1, self.total_pictures + 1):
            if self.take_picture(i):
                if i < self.total_pictures:  # Don't wait after the last picture
                    print(f"⏳ Waiting {delay_seconds} seconds before next picture...")
                    time.sleep(delay_seconds)
            else:
                print(f"❌ Failed to take picture {i}, stopping...")
                break
        
        print("-" * 50)
        print(f"📊 Summary: {self.pictures_taken}/{self.total_pictures} pictures taken successfully")
    
    def cleanup(self):
        """Clean up camera resources"""
        if self.camera:
            try:
                self.camera.stop()
                self.camera.close()
                print("🔒 Camera resources cleaned up")
            except Exception as e:
                print(f"⚠️  Warning during cleanup: {e}")
    
    def list_captured_images(self):
        """List all captured images"""
        if os.path.exists(self.output_dir):
            files = os.listdir(self.output_dir)
            if files:
                print(f"\n📋 Captured images in '{self.output_dir}':")
                for file in sorted(files):
                    file_path = os.path.join(self.output_dir, file)
                    file_size = os.path.getsize(file_path)
                    print(f"  📄 {file} ({file_size} bytes)")
            else:
                print(f"\n📁 Directory '{self.output_dir}' is empty")
        else:
            print(f"\n📁 Directory '{self.output_dir}' does not exist")

def main():
    """Main function"""
    print("=" * 60)
    print("📷 Raspberry Pi 5 Camera App")
    print("=" * 60)
    
    # Create camera app instance
    camera_app = PiCameraApp()
    
    try:
        # Setup camera
        if not camera_app.setup_camera():
            print("❌ Failed to setup camera. Exiting...")
            return
        
        # Take pictures
        camera_app.take_multiple_pictures(delay_seconds=2)
        
        # List captured images
        camera_app.list_captured_images()
        
        print("\n🎉 Camera session completed!")
        
    except KeyboardInterrupt:
        print("\n⚠️  Camera session interrupted by user")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
    finally:
        # Always cleanup
        camera_app.cleanup()
        print("\n👋 Goodbye!")

if __name__ == "__main__":
    main() 