# Plant Parenthood
## A Secure IoT Plant Sensor Application

Tess Lameyer, Lisa Carpenter, Ian Andrewson, Alan Hermanns, Ben Beekman

## DESCRIPTION:

Plant Parenthood is a secure server-side application that allows users to remotely gather and post data collected from a variety of sensors (light, temperature, humidity) via a Raspberry Pi.  Two-factor authentication ensures the integrity of data.  Data can be interpreted to make recommendations of common house plants that may thrive under matching environmental conditions.

## TECH STACK:

- Raspberry Pi 4B
  - Linux
  - Python 3.7.4
- Server
  - Node.js
  - MongoDB

## Configuring the Raspberry Pi:

### See https://projects.raspberrypi.org/en/projects/raspberry-pi-setting-up for detailed information about setting up a Raspberry Pi 4 or follow the directions that follow:
- Download the NOOBS operating system from [The Raspberry Pi NOOBS download page](https://www.raspberrypi.org/downloads/noobs/) into the root level of a formatted MicroSD card.  
- Eject the Micro SD card from your computer and insert it into the Raspberry Pi.
- Connect a display, keyboard, mouse, and power to your Raspberry Pi.
- Allow the device to boot into Raspbian, and complete the prompts, making sure to set a non-default password for your user.
- Confirm the dialog asking you to update the Raspberry Pi's software.
- Install updated software when prompted (allow adequate time for this).
- Open a terminal from the Accessories sub-menu of the Raspberry menu.
- Execute `sudo raspi-config` in the terminal, then navigate to `Network Options: Hostname`.
- Enter a new name that VNC Server will use to connect to the Pi.
- Navigate to `Interfacing Options`.
- Enable SSH - this will allow secure, remote access to your Raspberry Pi. 
- For photoresistor (light), enable SPI.
- For Adafruit TSL-2591, enable I2C.
- Restart the device (if you aren't prompted to do so, use `sudo reboot`).

## SENSOR HARDWARE

- Light: This setup requires the following:
  - 10KOhm resistor
  - MC3008 analog to digital converter
  - single cell photocell resistor
  - leads
  ![light sensor setup for raspberry pi](./lib/assets/light_pi.jpg)
   
- Temperature/Humidity: This setup requires the following:
  - DHT22 3 prong temperature/humidity sensor
  - leads
  - connect positive lead to 5V instead of 3.3V
  ![temperature/humidity sensor setup for raspberry pi](./lib/assets/temp_humid_pi.jpg)


### Using your Raspberry Pi from your computer

- In a terminal on the Raspberry Pi, execute `vncserver`.
- The command should respond with a number of details relating to the connection, including a VNC Server catchphrase which will help you ensure you're connecting to the right device, and a phrase "New desktop is `hostname:1` (where hostname is whatever you set earlier) followed by an ip address.
- On your computer, download and install VNC Client, and open the application.
- In the address bar of VNC viewer, type the `hostname:1` string that your raspberry pi responded with, and connect.
- You'll be prompted for your username and password, then you'll connect remotely to the device.

## How It Works

- user signs up
- verification happens (ensureUserAuth) to get the user to the page on the front end where the user can define the parameters of the pi data session
- user fills out form data for the session --> .post to the Heroku server (verify-session route) --> server sends back Token to the front end
- Token is sent from user front end computer to the raspberry pi directly via SSH command (shell command)
- Raspberry pi will use the token --> pulls info out of the token (id of session), verify that token was signed by our server --> uses this info to make the post to Heroku server via HTTP request (Python script)
- always a new token with every session!
