const chance = require('chance').Chance();

const PiDataSession = require('../models/PiDataSession');
const PiDataPoint = require('../models/PiDataPoint');
const Plant = require('../models/Plant');
const User = require('../models/User');


module.exports = async({ numPlants = 5,  numPiDataSessions = 5, numPiDataPoints = 5, numUsers = 2 } = {}) => {

  const users = await User.create([...Array(numUsers)].map((_, i) => ({
    email: `user${i}@tess.com`, 
    password: 'password', 
    role: 'user', 
    myPis: [{ piNickname: 'userPi' }]
  })));

  const userSessions = await PiDataSession.create([...Array(numPiDataSessions)].map(() => ({
    piNicknameId: chance.pickone(users.map(userInfo => userInfo.myPis.map(myPisArray => myPisArray._id))), 
    sensorType: 'light', 
    value: chance.integer(),
    piLocationInHouse: chance.word(), 
    city: chance.city()
  })));
  
  const admins = await User.create([...Array(numUsers)].map((_, i) => ({
    email: `admin${i}@tess.com`, 
    password: 'password', 
    role: 'admin',
    myPis: [{ piNickname: 'adminPi' }]
  })));
  
  await PiDataSession.create([...Array(numPiDataSessions)].map(() => ({
    piNicknameId: chance.pickone(admins.map(userInfo => userInfo.myPis.map(myPisArray => myPisArray._id))), 
    sensorType: 'light', 
    value: chance.integer(),
    piLocationInHouse: chance.word(), 
    city: chance.city()
  })));

  await PiDataPoint.create([...Array(numPiDataPoints)].map(() => ({
    piDataSessionId: chance.pickone(userSessions.map(session => session._id)), 
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
