require('dotenv').config();

const { getPiDataPoint, getPiDataSession, userAgent, getUser } = require('../lib/helpers/data-helpers');
const request = require('supertest');
const app = require('../lib/app');


describe('piDataPoint route tests', () => {
  it('(the pi) should be able to verify a session and post a data point using this route', async() => {
    const user = await getUser({ email: 'user0@tess.com' });

    let dataSessionId;
    return userAgent
    //to make sure that the agent gets assigned a data session cookie!
      .post('/api/v1/pi-data-sessions')
      .send({
        piNicknameId: user.myPis[0]._id , 
        sensorType: ['light'], 
        piLocationInHouse: 'kithcen', 
        city: 'Portland, OR'
      })
      .then(res=> {
        dataSessionId = res.body._id;
        //cookies persist, so this userAgent has the dataSession
        return userAgent
        //now that we have a cookie (dataSession), we can post a data point
          .post('/api/v1/pi-data-points') 
        //shape of data has to look like what the pi is sending
          .send({
            data: { 
              light: {
                averageValue: 10, 
                standardDeviation: 2
              }
            },
            piTimestamp: Date.now()
          })
          .set({ 'Content-Type':'application/json', 
            'dataSession': res.body.dataSession })
          .then(res => {
            console.log(res.body);
            expect(res.body).toEqual({
              _id: expect.any(String),
              piDataSessionId: dataSessionId,
              data: {
                light:{
                  averageValue: 10, 
                  standardDeviation: 2
                }
              },
              piTimestamp: expect.any(String),
              __v: 0 
            });
          });
      });
  });

  it('should be able to get all data points', async() => {
    const session = await getPiDataSession();
    const dataPoint = await PiDataPoint.create({
      piDataSessionId: session._id,
      data: {
        light: { averageValue: 10, standardDeviation: 9999 }
      },
      piTimestamp: Date.now()
    });

    return userAgent
      .get('/api/v1/pi-data-points/')
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.any(String),
          piDataSessionId: session._id,
          data: {
            light: { averageValue: 10, standardDeviation: 9999 }
          },
          piTimestamp: expect.any(String),
          __v: 0
        }]);
      });
  });
});
