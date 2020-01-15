require('dotenv').config();

const { getPiDataPoint, getPiDataSession, userAgent } = require('../lib/helpers/data-helpers');
const request = require('supertest');
const app = require('../lib/app');


describe('piDataPoint route tests', () => {
  it('(the pi) should be able to verify a session and post a data point using this route', async() => {
    const session = await getPiDataSession()
      // .then(session => console.log(session.cookies, 'this is the data session cookie'))
    
    console.log(session, 'this is the sessionnnnnnnnnn')

    userAgent
    //to make sure that the agent gets assigned a data session cookie!
      .post('/api/v1/pi-data-sessions')
    
    return request(app)
      .post('/api/v1/data-points') 
      .send({
        piDataSessionId: session._id,
        data: {
          averageValue: 10, 
          standardDeviation: 2
        },
        piTimestamp: Date.now()
      })
      .then(res => {
        // expect(res.header['set-cookie'][0]).toEqual(expect.stringContaining('session='));
        expect(res.body).toEqual({
          _id: expect.any(String),
          piDataSessionId: session._id.toString(),
          data: {
            averageValue: 10, 
            standardDeviation: 2
          },
          piTimestamp: Date.now(),
          __v: 0 
        });
      });
  });
});
