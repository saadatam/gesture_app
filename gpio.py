from gpiozero import LED
from time import sleep

# Create LED object on GPIO pin 17
red = LED(17)

try:
    print("Starting LED blink program...")
    print("Press Ctrl+C to stop")
    
    while True:
        red.on()
        print("LED ON")
        sleep(1)
        red.off()
        print("LED OFF")
        sleep(1)

except KeyboardInterrupt:
    print("\nProgram stopped by user")
    red.off()  # Ensure LED is off when program exits
    print("LED turned off")
except Exception as e:
    print(f"Error: {e}")
    red.off()  # Ensure LED is off on error