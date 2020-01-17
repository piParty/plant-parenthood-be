import urllib
from bs4 import BeautifulSoup
import json
import os

level = ['low', 'medium', 'high']

def get_plants(light_level):
    plants = []
    plants_page = 'https://greeneryunlimited.co/collections/all-plants/{}-light'.format(level[0])
    page = urllib.request.urlopen(plants_page)
    html_soup = BeautifulSoup(page, 'html.parser')
    plant_name_box = html_soup.find_all('div',  attrs={"class": "info"})
    
    for i in plant_name_box:
        plants.append(i.text.split('|')[0].strip())

    return plants

low_light_plants = get_plants(level[0])
medium_light_plants = get_plants(level[1])
high_light_plants = get_plants(level[2])

file = open("./plants.json", "w")
file.write(json.dumps({ "low_light_plants": low_light_plants,\
                "medium_light_plants": medium_light_plants,\
                "high_light_plants": high_light_plants }))
