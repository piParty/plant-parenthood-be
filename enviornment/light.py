import argparse
import numpy as np
import spidev
from datetime import datetime
import time
import os
import json
import requests

def get_args():
    parser = argparse.ArgumentParser()
    t_desc = "token assigned at start of data session"
    
    parser.add_argument("t", help = t_desc)
    args = parser.parse_args()
    
    return args

# authenticate user token using args.t

spi = spidev.SpiDev()
spi.open(0,0)
spi.max_speed_hz=1000000

cycle_delay = 20
num_cycles = 3
reading_interval = 0.5
num_readings = 10

def read_channel(channel):
    adc = spi.xfer2([1, (8 + channel) << 4, 0])
    data = ((adc[1] & 3) << 8) + adc[2]
    return data

def post_data(data_bundle):
    r = requests.post('192.168.1.49:7890',\ 
                        headers = { 'Content-Type': 'application/json' },\ 
                        data = json.dumps(data_bundle, default=str)) 
    print(r.status_code)
    print(r.text)
# cycle through data collection intervals
for i in range(num_cycles):
    # read value and post data bundle to server
    light_data = np.zeros(num_readings)
    for j in range(num_readings):
        light_level = read_channel(0)
        light_data[j] = (light_level)
        time.sleep(reading_interval)
    print(light_data)
    data_bundle = {
        "avg_value": np.average(light_data),
        "std_dev": np.std(light_data),
        "time_stamp": datetime.now(),
        "piDataSessionId": 3
        }
    print(data_bundle)
    post_data(data_bundle)
    time.sleep(cycle_delay)