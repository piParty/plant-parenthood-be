const chance = require('chance').Chance();

const PiDataSession = require('../models/PiDataSession');
const PiDataPoint = require('../models/PiDataPoint');
const Plant = require('../models/Plant');
const User = require('../models/User');


module.exports = async({ numPlants = 5,  numPiDataSessions = 5, numPiDataPoints = 5, numUsers = 2 } = {}) => {

  await User.create([...Array(numUsers)].map((_, i) => ({
    email: `user${i}@tess.com`, 
    password: 'password', 
    role: 'user', 
    myPis: [{ piNickname: 'userPi' }]
  })));
  
  await User.create([...Array(numUsers)].map((_, i) => ({
    email: `admin${i}@tess.com`, 
    password: 'password', 
    role: 'admin',
    myPis: [{ piNickname: 'adminPi' }]
  })));
  
  //update piNickname field to connect to specific user above
  const sessions = await PiDataSession.create([...Array(numPiDataSessions)].map(() => ({
    piNickname: chance.name() + ' pi', 
    sensorType: 'light', 
    value: chance.integer(),
    piLocationInHouse: chance.word(), 
    city: chance.city()
  })));

  await PiDataPoint.create([...Array(numPiDataPoints)].map(() => ({
    piDataSessionId: chance.pickone(sessions.map(session => session._id)), 
    data: {
      light: { 
        averageValue: chance.integer(), 
        standardDeviation: chance.integer()
      }
    }, 
    piTimestamp: chance.timestamp()
  })));

  await Plant.create([...Array(numPlants)].map(() => ({
    commonName: chance.name() + 'plant', 
    waterPreference: 'low', 
    sunlightPreference: 'low',
  })));

};
