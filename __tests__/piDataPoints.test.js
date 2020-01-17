require('dotenv').config();

const { getPiDataPoints, getPiDataSession, userAgent, getUser } = require('../lib/helpers/data-helpers');

describe('piDataPoint route tests', () => {
  it('(the pi) should be able to verify a session and post a data point using this route', async() => {
    const user = await getUser({ email: 'user0@tess.com' });

    let dataSessionId;
    return userAgent
    //to make sure that the agent gets assigned a data session token!
      .post('/api/v1/pi-data-sessions')
      .send({
        piNicknameId: user.myPis[0]._id, 
        sensorType: ['light'], 
        piLocationInHouse: 'kithcen', 
        city: 'Portland, OR'
      })
      .then(res=> {
        console.log(res.body);
        dataSessionId = res.body._id;
        //tokens persist, so this userAgent has the dataSession
        return userAgent
        //now that we have a token (dataSession), we can post a data point
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
    const dataPoints = await getPiDataPoints({ piDataSessionId: session._id });

    return userAgent
      .get('/api/v1/pi-data-points/')
      .then(res => {
        dataPoints.forEach(datum => {
          expect(res.body).toContainEqual({
            _id: expect.any(String),
            piDataSessionId: session._id.toString(),
            data: datum.data,
            piTimestamp: expect.any(String),
            __v: 0
          });
        });
      });
  });
});
