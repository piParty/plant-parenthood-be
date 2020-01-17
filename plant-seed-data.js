require('dotenv').config();
const plants = require('./plants.json');
const Plant = require('./lib/models/Plant');
require('./lib/utils/connect')();
const mongoose = require('mongoose');

const plantObjectsArray = plants.low_light_plants.map(plantName => {
  return ({
    commonName: plantName,
    sunlightPreference: 'low'
  });
});

const seedPlants = async() => await Plant.create(plantObjectsArray)
  .then(() => mongoose.connection.close());

seedPlants();
