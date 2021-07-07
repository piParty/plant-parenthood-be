require('dotenv').config();
const plants = require('./plants.json');
const Plant = require('./lib/models/Plant');
require('./lib/utils/connect')();
const mongoose = require('mongoose');

// remove a bit of duplication
const createPlantArray = (plants, sunlightPreference) =>
  plants[`${sunlightPreference}_light_plants`]
    .map(commonName => ({
      commonName,
      sunlightPreference
  }))

const lowLightPlantObjectsArray = createPlantArray(plants, 'low')
const mediumLightPlantObjectsArray = createPlantArray(plants, 'medium')
const highLightPlantObjectsArray = createPlantArray(plants, 'high')

// no need for async/await here
const seedLowLightPlants = () => Plant.create(lowLightPlantObjectsArray);
const seedMediumLightPlants = () => Plant.create(mediumLightPlantObjectsArray);
const seedHighLightPlants = () => Plant.create(highLightPlantObjectsArray);

// could batch all these together
// Promise.all([seedLowLightPlants(), seedMediumLightPlants(), seedHighLightPlants()])
//   .then(() => mongoose.connection.close());

Plant
  .create([
    ...lowLightPlantObjectsArray,
    ...mediumLightPlantObjectsArray,
    ...highLightPlantObjectsArray
  ])
  .finally(() => mongoose.connection.close());
