import argparse
import Adafruit_DHT
import numpy as np
import spidev
from datetime import datetime
import time
import os
import json
import requests

def get_args():
    parser = argparse.ArgumentParser()
    c_description = "cookie assigned at start of data session"
    s_description = "sensor types separated by commas: 'light',\
                    'temperature/humidity', or 'light-hdr'"

    parser.add_argument("-c", required=True, help=c_description)
    parser.add_argument("-s", required=True, help=s_description)
    args = parser.parse_args()

    return args

args = get_args()
cookie = args.c
sensors = args.s.split(',')

cycle_delay = 10
num_cycles = 2
reading_interval = 1
num_readings = 3

if "light" in sensors:
    spi = spidev.SpiDev()
    spi.open(0,0)
    spi.max_speed_hz=1000000
    
def get_light_reading():
    adc = spi.xfer2([1, 8 << 4, 0])
    data = ((adc[1] & 3) << 8) + adc[2]
    return data
    
def get_temp_hum_readings():
    sensor = Adafruit_DHT.DHT11
    gpio = 17
    
    return Adafruit_DHT.read_retry(sensor, gpio)

def post_data(data_bundle):
    r = requests.post('http://192.168.1.204:7890/api/v1/dataPoints',\
                        headers = { 'Content-Type': 'application/json', 'cookies': cookie },\
                        data = json.dumps(data_bundle, default=str))
    print(r.status_code)
    print(r.text)
# cycle through data collection intervals

for i in range(num_cycles):
    # read value and post data bundle to server
    if "light" in sensors:
        light_data = np.zeros(num_readings)
    if "temperature/humidity" in sensors:
        temperature_data = np.zeros(num_readings)
        humidity_data = np.zeros(num_readings)
    for j in range(num_readings):
        if "light" in sensors:
            light_level = get_light_reading()
            light_data[j] = light_level
            light_stats = {
            "averageValue": np.average(light_data),
            "standardDeviation": np.std(light_data)
            }
        if "temperature/humidity" in sensors:
            humidity, temperature = get_temp_hum_readings()
            humidity_data[j] = humidity
            temperature_data[j] = temperature
            humidity_stats = {
            "averageValue": np.average(humidity_data),
            "standardDeviation": np.std(humidity_data)
            }
            temperature_stats = {
            "averageValue": np.average(temperature_data),
            "standardDeviation": np.std(temperature_data)
            }
        time.sleep(reading_interval)
    data_bundle = {
        "data": {},
        "time_stamp": datetime.now()
        }
    if "light" in sensors:
        data_bundle["data"]["light"] = light_stats
    if "temperature/humidity" in sensors:
        data_bundle["data"]["humidity"] = humidity_stats
        data_bundle["data"]["temperature"] = temperature_stats
    print(data_bundle)
    post_data(data_bundle)
    time.sleep(cycle_delay)
    