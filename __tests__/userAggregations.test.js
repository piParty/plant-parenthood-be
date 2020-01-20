require('dotenv').config();
const { getUser, userAgent, adminAgent } = require('../lib/helpers/data-helpers');
const request = require('supertest');
const app = require('../lib/app');


describe('user aggregation route tests', () => {
  describe('piDataSession tests for getting all data sessions by user', () => {
    it('should be able to get all piDataSessions by user', async() => {
      const user = await getUser({ email: 'user0@tess.com' });

      let dataSessionId1;
      let dataSessionId2;
      return userAgent
      //agent must post a session to get dataSession token before pi can post any data points
        .post('/api/v1/user-pi-data-sessions')
        .send({ piNickname: 'happyPi', sensorType: 'light', piLocationInHouse: 'kitchen', city: 'Portland' })
        .then(res => {
          dataSessionId1 = res.body._id;
          return userAgent
          //hitting aggregation route
            .get(`/api/v1/user-pi-data-sessions/${user._id}`)
            .then(res => {
              dataSessionId2 = res.body._id;
              console.log(dataSessionId1, dataSessionId2);
              expect(res.body).toEqual([{}, {}]);
            });
        });
    });
  });
});

// it('should throw an error if a user tries to do this aggregation without being logged in', () => {
//   return request(app)
//     .get('/api/v1/pi-data-sessions/')
//     .then(res => {
//       expect(res.body).toEqual({
//         message: 'Login required.',
//         status: 403
//       });
//     });
// });

// });
