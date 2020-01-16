require('dotenv').config();
const PiDataPoint = require('../lib/models/PiDataPoint.js');
const { getPiDataSession, userAgent } = require('../lib/helpers/data-helpers');

describe('piDataPoint route tests', () => {

  it('(the pi) should be able to verify a session and post a data point using this route', () => {

    let dataSessionId;
    return userAgent
    //to make sure that the agent gets assigned a data session cookie!
      .post('/api/v1/pi-data-sessions')
      .send({
        piNickname: 'happyPi', 
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
          .then(res => {
            expect(res.body).toEqual({
              _id: expect.any(String),
              piDataSessionId: dataSessionId.toString(),
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
