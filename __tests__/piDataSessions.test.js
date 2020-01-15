require('dotenv').config();
const { userAgent, getUser, getPiDataSession } = require('../lib/helpers/data-helpers.js');
const connect = require('../lib/utils/connect.js');
const request = require('supertest');
const app = require('../lib/app.js');
const mongoose = require('mongoose');
const PiDataSession = require('../lib/models/PiDataSession.js');


describe('piDataSession route tests', () => {

  // beforeAll(() => {
  //   connect();
  // }); 

  // beforeEach(() => {
  //   return mongoose.connection.dropDatabase();
  // });

  // afterAll(() => {
  //   return mongoose.connection.close();
  // });

  it('should be able to post a new session', () => {
    return userAgent
      .post('/api/v1/pi-data-sessions')
      .send({ 
        piNickname: 'testPi', 
        sensorType: ['light'],
        piLocationInHouse: 'living room, east wall',
        city: 'Portland, Oregon'
      })
      .then(res => {
        expect(res.header['set-cookie'][0]).toEqual(expect.stringContaining('dataSession='));
        expect(res.body).toEqual({
          _id: expect.any(String),
          piNickname: 'testPi',
          sensorType: ['light'],
          piLocationInHouse: 'living room, east wall',
          city: 'Portland, Oregon',
          __v: 0
        });
      });
  });

  it('should throw an error when a user posts data without being logged in', () => {
    return request(app)
      .post('/api/v1/pi-data-sessions/')
      .send('this should error')
      .then(res => {
        expect(res.body).toEqual({
          message: 'Login required.',
          status: 403
        });
      });
  });

  it('should be able to get a dataSession by ID', async() => {
    const session = await PiDataSession.create({ 
      piNickname: 'testPi', 
      sensorType: ['light'],
      piLocationInHouse: 'living room, east wall',
      city: 'Portland, Oregon'
    });
    
    return userAgent
      .get(`/api/v1/pi-data-sessions/${session._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: session._id.toString(),
          piNickname: 'testPi',
          sensorType: ['light'],
          piLocationInHouse: 'living room, east wall',
          city: 'Portland, Oregon',
          __v: 0
        });
      });
  });

  it('should error if a user tries to get a dataSession without being logged in', () => {
    const session = getPiDataSession();
    return request(app)
      .get(`/api/v1/pi-data-sessions/${session.id}`)
      .then(res => {
        expect(res.body).toEqual({
          message: 'Login required.',
          status: 403
        });
      });
  });

  it('should be able to get all dataSessions', async() => {
    const sessions = await PiDataSession.create([
      { piNickname: 'test1', sensorType: ['light'], piLocationInHouse: 'east', city: 'Here' },
      { piNickname: 'test2', sensorType: ['light'], piLocationInHouse: 'west', city: 'There' },
      { piNickname: 'test3', sensorType: ['light'], piLocationInHouse: 'kitchen', city: 'anywhere' }
    ]);

    return userAgent
      .get('/api/v1/pi-data-sessions')
      .then(res => {
        sessions.forEach(session => {
          expect(res.body).toContainEqual({
            _id: session._id.toString(),
            piNickname: session.piNickname,
            sensorType: ['light'],
            piLocationInHouse: session.piLocationInHouse,
            city: session.city,
            __v: 0
          });
        });
      });
  });

  it('should throw an error if a user tries to get all dataSessions without being logged in', () => {
    return request(app)
      .get('/api/v1/pi-data-sessions/')
      .then(res => {
        expect(res.body).toEqual({
          message: 'Login required.',
          status: 403
        });
      });
  });

  it('should be able to update a data session', async() => {
    const session = await getPiDataSession();
    return userAgent
      .patch(`/api/v1/pi-data-sessions/${session._id}`)
      .send({ sensorType: ['Gamma Ray'] })
      .then(res => {
        expect(res.body).toEqual({
          _id: session._id,
          piNickname: session.piNickname,
          sensorType: ['Gamma Ray'],
          piLocationInHouse: session.piLocationInHouse,
          city: session.city,
          __v: 0
        });
      });
  });

  it('should throw an error if a user tries to update a dataSession without being logged in', async() => {
    const session = await getPiDataSession();
    return request(app)
      .patch(`/api/v1/pi-data-sessions/${session.id}`)
      .send({ sensorType: ['Gamma Ray'] })
      .then(res => {
        expect(res.body).toEqual({
          message: 'Login required.',
          status: 403
        });
      });
  });

  it('should be able to delete a dataSession', async() => {
    const session = await getPiDataSession();
    return userAgent
      .delete(`/api/v1/pi-data-sessions/${session._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          piNickname: session.piNickname,
          sensorType: session.sensorType,
          piLocationInHouse: session.piLocationInHouse,
          city: session.city,
          __v: 0
        });
      });
  });

  it('should throw an error if a user tries to delete a sessionId without being logged in', async() => {
    const session = await getPiDataSession();
    return request(app)
      .delete(`/api/v1/pi-data-sessions/${session.id}`)
      .then(res => {
        expect(res.body).toEqual({
          message: 'Login required.',
          status: 403
        });
      });
  });
});
