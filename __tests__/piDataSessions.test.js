require('dotenv').config();
const connect = require('../lib/utils/connect.js');
const request = require('supertest');
const app = require('../lib/app.js');
const mongoose = require('mongoose');
const PiDataSession = require('../lib/models/PiDataSession.js');


describe('piDataSession route tests', () => {

  beforeAll(() => {
    connect();
  }); 

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('should be able to post a new session', () => {
    return request(app)
      .post('/api/v1/piDataSessions')
      .send({ 
        piNickname: 'testPi', 
        sensorType: 'light',
        piLocationInHouse: 'living room, east wall',
        city: 'Portland, Oregon'
      })
      .then(res => {
        expect(res.header['set-cookie'][0]).toEqual(expect.stringContaining('dataSession='));
        expect(res.body).toEqual({
          _id: expect.any(String),
          piNickname: 'testPi',
          sensorType: 'light',
          piLocationInHouse: 'living room, east wall',
          city: 'Portland, Oregon',
          __v: 0
        });
      });
  });

  it('should be able to get a dataSession by ID', async() => {
    const session = await PiDataSession.create({ 
      piNickname: 'testPi', 
      sensorType: 'light',
      piLocationInHouse: 'living room, east wall',
      city: 'Portland, Oregon'
    });
    return request(app)
      .get(`/api/v1/piDataSessions/${session._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: session._id.toString(),
          piNickname: 'testPi',
          sensorType: 'light',
          piLocationInHouse: 'living room, east wall',
          city: 'Portland, Oregon',
          __v: 0
        });
      });
  });

  it('should be able to get all dataSessions', async() => {
    const sessions = await PiDataSession.create([
      { piNickname: 'test1', sensorType: 'light', piLocationInHouse: 'east', city: 'Here' },
      { piNickname: 'test2', sensorType: 'light', piLocationInHouse: 'west', city: 'There' },
      { piNickname: 'test3', sensorType: 'light', piLocationInHouse: 'kitchen', city: 'anywhere' }
    ]);

    return request(app)
      .get('/api/v1/piDataSessions')
      .then(res => {
        sessions.forEach(session => {
          expect(res.body).toContainEqual({
            _id: session._id.toString(),
            piNickname: session.piNickname,
            sensorType: 'light',
            piLocationInHouse: session.piLocationInHouse,
            city: session.city,
            __v: 0
          });
        });
      });
  });

  it('should be able to update a data session', async() => {
    const session = await PiDataSession.create({ 
      piNickname: 'testPi', 
      sensorType: 'light',
      piLocationInHouse: 'living room, east wall',
      city: 'Portland, Oregon'
    });
    return request(app)
      .patch(`/api/v1/piDataSessions/${session._id}`)
      .send({ sensorType: 'Gamma Ray' })
      .then(res => {
        expect(res.body).toEqual({
          _id: session._id.toString(),
          piNickname: 'testPi',
          sensorType: 'Gamma Ray',
          piLocationInHouse: 'living room, east wall',
          city: 'Portland, Oregon',
          __v: 0
        });
      });
  });

  it('should be able to delete a dataSession', async() => {
    const session = await PiDataSession.create({ 
      piNickname: 'testPi', 
      sensorType: 'light',
      piLocationInHouse: 'living room, east wall',
      city: 'Portland, Oregon'
    });
    return request(app)
      .delete(`/api/v1/piDataSessions/${session._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          piNickname: 'testPi',
          sensorType: 'light',
          piLocationInHouse: 'living room, east wall',
          city: 'Portland, Oregon',
          __v: 0
        });
      });
  });
});
