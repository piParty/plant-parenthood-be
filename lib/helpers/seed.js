const chance = require('chance').Chance();

const PiDataSession = require('../models/PiDataSession');
const Plant = require('../models/Plant');
const User = require('../models/User');


module.exports = async({ numPlants = 5,  numPiDataSessions = 5, numUsers = 2 } = {}) => {

  await User.create([...Array(numUsers)].map(() => ({
    email: 'user@tess.com', 
    password: 'password', 
    role: 'user', 
  })));
  
  await User.create([...Array(numUsers)].map(() => ({
    email: 'admin@tess.com', 
    password: 'password', 
    role: 'admin'
  })));
  
  await PiDataSession.create([...Array(numPiDataSessions)].map(() => ({
    piNickname: chance.name() + 'pi', 
    sensorType: 'light', 
    value: chance.integer(),
    piLocationInHouse: chance.word(), 
    city: chance.city()
  })));

  await Plant.create([...Array(numPlants)].map(() => ({
    commonName: chance.name() + 'plant', 
    waterPreference: 'low', 
    sunlightPreference: 'low',
  })));

};
