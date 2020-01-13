require('dotenv').config();
const connect = require('../utils/connect');
const mongoose = require('mongoose');
const seed = require('./seed');
const request = require('supertest');
const app = require('../app');

const PiData = require('../models/PiData');
const Plant = require('../models/Plant');

const User = require('../models/User');

beforeAll(() => {
  connect();
});

beforeEach(() => {
  return mongoose.connection.dropDatabase();
});

beforeEach(() => {
  //where we can set the number of data entries for our testing
  return seed({ numPlants = 5,  numPiDatas = 5, numUsers = 1 } = {});
});

const userAgent = request.agent(app);
const adminAgent = request.agent(app);
//don't need to specify the admin vs user here because its a login
beforeEach(async() => {
  await userAgent
    .post('/api/v1/auth/login')
    .send({ email: 'user@tess.com', password: 'password' });
  await adminAgent
    .post('/api/v1/auth/login')
    .send({ email: 'admin@tess.com', password: 'password' });
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
  ...createGetters(PiData),
  ...createGetters(User),
  userAgent, 
  adminAgent
};
