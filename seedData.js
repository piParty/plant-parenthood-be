require('dotenv').config();
require('./lib/utils/connect.js')();

const mongoose = require('mongoose');
const seed = require('./lib/helpers/seed.js');

mongoose.connection.dropDatabase();
seed({ numPlants: 5,  numPiDataSessions: 10, numPiDataPoints: 5, numUsers: 2 })
  .then(() => console.log('data seeded'))
  .finally(() => mongoose.connection.close());
