require('dotenv').config();
const connect = require('../utils/connect');
const mongoose = require('mongoose');
const seed = require('./seed');
const request = require('supertest');
const app = require('../app');

const PiDataSession = require('../models/PiDataSession');
const PiDataPoint = require('../models/PiDataPoint');
const Plant = require('../models/Plant');

const User = require('../models/User');

beforeAll(() => {
  connect();
});

beforeEach(() => {
  return mongoose.connection.dropDatabase();
});

beforeEach(() => {
  return seed({ numPlants: 5,  numPiDataSessions: 5, numPiDataPoints: 5, numUsers: 2 });
});

const userAgent = request.agent(app);
const adminAgent = request.agent(app);
//don't need to specify the admin vs user here because its a login
beforeEach(async() => {
  await userAgent
    .post('/api/v1/auth/login')
    .send({ email: 'user0@tess.com', password: 'password' });
  await adminAgent
    .post('/api/v1/auth/login')
    .send({ email: 'admin0@tess.com', password: 'password' });
});

afterAll(() => {
  return mongoose.connection.close();
});

const prepare = doc => JSON.parse(JSON.stringify(doc));

const createGetters = Model => {
  const modelName = Model.modelName;

  return {
    [`get${modelName}`]: (query) => Model.findOne(query).then(prepare),
    [`get${modelName}s`]: (query) => Model.find(query).then(docs => docs.map(prepare))
  };
};

module.exports = {
  ...createGetters(Plant),
  ...createGetters(PiDataSession),
  ...createGetters(PiDataPoint),
  ...createGetters(User),
  userAgent, 
  adminAgent
};
