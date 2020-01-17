require('dotenv').config();
const plants = require('./plants.json');
const Plant = require('./lib/models/Plant');
require('./lib/utils/connect')();
const mongoose = require('mongoose');

const lowLightPlantObjectsArray = plants.low_light_plants.map(plantName => {
  return ({
    commonName: plantName,
    sunlightPreference: 'low'
  });
});

const mediumLightPlantObjectsArray = plants.medium_light_plants.map(plantName => {
  return ({
    commonName: plantName,
    sunlightPreference: 'medium'
  });
});

const highLightPlantObjectsArray = plants.high_light_plants.map(plantName => {
  return ({
    commonName: plantName,
    sunlightPreference: 'high'
  });
});

const seedLowLightPlants = async() => await Plant.create(lowLightPlantObjectsArray);

const seedMediumLightPlants = async() => await Plant.create(mediumLightPlantObjectsArray);

const seedHighLightPlants = async() => await Plant.create(highLightPlantObjectsArray);

seedLowLightPlants()
  .then(() => seedMediumLightPlants())
  .then(() => seedHighLightPlants())
  .then(() => mongoose.connection.close());

// Promise.all([seedLowLightPlants(), seedMediumLightPlants(), seedHighLightPlants()])
//   .then(mongoose.connection.close());
