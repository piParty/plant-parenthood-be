# :seedling: Plant Parenthood :seedling:

## A Secure IoT Plant Sensor Application

Tess Lameyer, Lisa Carpenter, Ian Andrewson, Alan Hermanns, Ben Beekman

## DESCRIPTION

Plant Parenthood is a secure server-side application that allows users to remotely gather and post data collected from a variety of sensors (light, temperature, humidity) via a Raspberry Pi. Two-factor authentication ensures the integrity of data. Data can be interpreted to make recommendations of common house plants that may thrive under matching environmental conditions.

## PROBLEM DOMAIN

There are many kits avaiable on the market that make it possible to monitor environmental conditions for house plants. However, the market lacks an application that caters plant recommendations to users based on baseline environmental conditions. This application aims to fill this gap, providing a secure, simple way to collect data remotely pertaining to the light, temperature, and humidity at a specific location. These environmental indicators can then be used to customize plant recommendations for each user.

## VERSION 1.0.0

## TECH STACK:

- Raspberry Pi 4 B
  - Linux
  - Python 3.7.4
    - argparse
    - Adafruit_DHT
    - numpy as np
    - spidev
    - datetime
    - time
    - os
    - json
    - requests
- Server
  - Node.js
  - MongoDB
- Packages
  - "bcryptjs": "^2.4.3",
  - "cookie-parser": "^1.4.4",
  - "dotenv": "^8.2.0",
  - "express": "^4.17.1",
  - "inquirer": "^7.0.3",
  - "jsonwebtoken": "^8.5.1",
  - "mongoose": "^5.8.6",
  - "node-ssh": "^7.0.0",
  - "python3": "0.0.1"

## RAPBERRY PI CONFIGURATION

- See https://projects.raspberrypi.org/en/projects/raspberry-pi-setting-up for more detailed information about installing the Raspbian OS on a Raspberry Pi 4

  - Download the NOOBS operating system from [The Raspberry Pi NOOBS download page](https://www.raspberrypi.org/downloads/noobs/) to the root level of a formatted MicroSD card.
  - Eject the Micro SD card from your computer and insert it into the Raspberry Pi.
  - Connect a display, keyboard, mouse, and power supply to your Raspberry Pi.
  - After booting into Raspbian, complete the prompts, setting a non-default password for Raspberry Pi.
  - Follow prompts to update the Raspberry Pi's software.
  - Execute `sudo raspi-config` in a Raspberry Pi terminal
    - Navigate to _Network Options: Hostname_ to change the hostname.
    - Navigate to _Interfacing Options_
      - Enable SSH - this will allow secure, remote access to your Raspberry Pi.
      - For photoresistor (light), enable SPI.
      - For Adafruit TSL-2591 (temperature/humidity), enable I2C.
  - Restart the device using `sudo reboot`.



## SENSOR HARDWARE AND SETUP

The following should be installed and up-to-date on Raspberry Pi:
  - python 3
  - setuptools, 
  - wheel
  - pip 
  - python

```
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install python-dev python3-dev python3-pip
sudo python3 -m pip install --upgrade pip setuptools wheel
```

## REQUIRED INSTALLATIONS ON RASPBERRY PI

- To use the photoresistor to measure light, install spidev:
 `sudo pip3 install spidev`
- To use the DHT22 Humidity/Temperature sensor, install Adafruit_DHT:
 `sudo pip3 install Adafruit_DHT` 

### Light

Required Hardware

- 10KOhm resistor
- MCP3008 analog to digital converter
- single cell photocell resistor
- variety of leads
  ![light sensor setup for raspberry pi](./lib/assets/light_pi.jpg)

### Temperature/Humidity

Required Hardware

- DHT22 3 prong temperature/humidity sensor
- variety of leads
- connect positive lead to 5V instead of 3.3V
  ![temperature/humidity sensor setup for raspberry pi](./lib/assets/temp_humid_pi.jpg)

## APPLICATION ENDPOINTS

METHOD | path | Authorization

### /api/v1/auth

#### POST | /signup | any

#### POST | /login | any

#### POST | /verify | any

#### PATCH | /myPis/:id | admin only

#### PATCH | /change-role/:id | admin only

#### POST | /logout | any

#### DELETE | /:id | admin only

### /api/v1/pi-data-sessions

#### POST | / | any user

SAMPLE REQUEST

```
{
   "piNicknameId": "abcdef123456abcdef123456",
   "sensorType": "light",
   "piLocationInHouse": "kitchen window",
   "city": "Portland"
}
```

SAMPLE RESPONSE

```
{
    "sensorType": [
        "light"
    ],
    "_id": "5e2490711985840017d24245",
    "piNicknameId": "abcdef123456abcdef123456",
    "piLocationInHouse": "kitchen window",
    "city": "Portland",
    "__v": 0,
    "dataSession": "<data_session_token"
}
```

#### GET | /:id | any user

SAMPLE RESPONSE

```
{
    "sensorType": [
        "light"
    ],
    "_id": "5e2490711985840017d24245",
    "piNicknameId": "abcdef123456abcdef123456",
    "piLocationInHouse": "kitchen window",
    "city": "Portland",
    "__v": 0
}
```

#### GET | / | admin only

### /api/v1/pi-data-points

#### POST | / | any user with valid token

#### GET | / | any User

### /api/v1/plants

#### POST | / | admin only

#### GET | / | any

SAMPLE RESPONSE

```
[{
    "_id": "5e2367bf147e098f466c8998",
    "commonName": "Aglaonema Marie",
    "sunlightPreference": "low",
    "__v": 0
  },
  {
    "_id": "5e2367bf147e098f466c899a",
    "commonName": "Aglaonema Silver Bay",
    "sunlightPreference": "low",
    "__v": 0
  },
  {
    "_id": "5e2367bf147e098f466c899d",
    "commonName": "Sansevieria Fernwood",
    "scientificName": "Sansevieria fernieria",
    "sunlightPreference": "low",
    "__v": 0
}]
```

#### GET | /light/:type | any

SAMPLE RESPONSE FOR /light/high

```
[{
    "_id": "5e236520c898e88eb207700d",
    "commonName": "Fiddle Leaf Fig Tree",
    "sunlightPreference": "high",
    "__v": 0
  },
  {
    "_id": "5e236520c898e88eb2077014",
    "commonName": "Haworthia",
    "sunlightPreference": "high",
    "__v": 0
  },
  {
    "_id": "5e236520c898e88eb2077012",
    "commonName": "Pilea Peperomioides",
    "sunlightPreference": "high",
    "__v": 0
}]
```

#### GET | /:id | any

SAMPLE RESPONSE

```
{
  "_id": "5e236520c898e88eb207700d",
  "commonName": "Fiddle Leaf Fig Tree",
  "sunlightPreference": "high",
  "__v": 0
}
```

#### PATCH | /:id | admin only

#### DELETE | /:id | admin only

## DATABASE MODELS

#### User

```
{
  email: {
    type: String,
    required: true,
    unique: [true, 'Email is taken']
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'user'],
    default: 'user'
  },
  myPis: {
    type: [description: String,
  piNickname: {
    type: String,
    required: true
  }],
    required: true,
    validate: {
      validator: function(myPis) {
        return myPis.length > 0;
      },
      message: 'Pi registration required.'
    }
  }
```

#### PiDataSession

```
{
  piNicknameId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  sensorType: {
    type: [String],
    enum: ['light', 'humidity', 'temperature'],
    required: true
  },
  piLocationInHouse: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  notes: String
}
```

#### PiDataPoint

```
{
  piDataSessionId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'PiDataSession',
  required: true
  },
  data: {
    type: Object,
    required: true
  },
  piTimestamp: {
    type: Date,
    required: true
  }
}
```

#### Plant

```
{
  commonName: {
  type: String,
  required: true,
  unique: [true, 'Plant name is already in database']
  },
  scientificName: {
    family: String,
    genus: String,
    species: String
  },
  waterPreference: String,
  sunlightPreference: {
    type: String,
    enum: ['low', 'medium', 'high']
  }
}
```

## INITIALIZING A REMOTE DATA COLLECTION SESSION

    SSH pi@<pi Hostname>
    wget https://raw.githubusercontent.com/piParty/pi-party/dev/environment/pi_data_session.py
    python3 ./pi_data_session.py -c <valid_token_from_cookie> -s <sensor1,sensor2>

## LICENSING

Copyright 2020 Pi Party
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
