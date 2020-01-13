const chance = require('chance').Chance();


const PiData = require('../models/PiData');
const Plant = require('../models/Plant');

const User = require('../models/User');


module.exports = async({ numPlants = 5,  numPiDatas = 5, numUsers = 1 } = {}) => {

  const userRoleUsers = await User.create([...Array(numUsers)].map(() => ({
    email: 'user@tess.com', 
    password: 'password', 
    role: 'user', 
    // dataCollections: [{
    //   piDataId: chance.pickone((piDatas.map(piData => piData._id)))
    // }]
      
  })));
  await PiData.create([...Array(numPiDatas)].map(() => ({
    raspberryPi: chance.name() + 'pi', 
    sensorType: 'light', 
    value: chance.integer(),
    piLocationInHouse: chance.word(), 
    userId: chance.pickone((userRoleUsers.map(userRoleUser => userRoleUser._id))), 
    city: chance.city()
  })));

  const userRoleAdmins = await User.create([...Array(numUsers)].map(() => ({
    email: 'admin@tess.com', 
    password: 'password', 
    role: 'admin'
  })));
  await PiData.create([...Array(numPiDatas)].map(() => ({
    raspberryPi: chance.name() + 'pi', 
    sensorType: 'light', 
    value: chance.integer(),
    piLocationInHouse: chance.word(), 
    userId: chance.pickone((userRoleAdmins.map(userRoleAdmin => userRoleAdmin._id))), 
    city: chance.city()
  })));

  await Plant.create([...Array(numPlants)].map(() => ({
    commonName: chance.name() + 'plant', 
    waterPreference: 'low', 
    sunlightPreference: 'low',
  })));

};
