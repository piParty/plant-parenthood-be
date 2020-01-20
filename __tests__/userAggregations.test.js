require('dotenv').config();
const { getUser, userAgent, adminAgent } = require('../lib/helpers/data-helpers');
const request = require('supertest');
const app = require('../lib/app');


describe('user aggregation route tests', () => {
  describe('piDataSession tests for getting all data sessions by user', () => {
    it('should be able to get all piDataSessions by user', async() => {
      const user = await getUser({ email: 'user0@tess.com' });
      console.log(user, 'user');

      let dataSessionId1;
      let dataSessionId2;
      return userAgent
      //agent must post a session to get dataSession token before pi can post any data points
        //posting first session
        .post('/api/v1/pi-data-sessions')
        .send({ 
          piNicknameId: user.myPis[0]._id, 
          sensorType: 'light', 
          piLocationInHouse: 'kitchen', 
          city: 'Portland'
        })
        .then(res => {
          console.log(res.body, 'this is the first body');
          dataSessionId1 = res.body._id;
          console.log(res.body._id, 'this is the id');
          return userAgent
          //posting second session
            .post('/api/v1/pi-data-sessions')
            .send({ 
              piNicknameId: user.myPis[1]._id, 
              sensorType: 'light', 
              piLocationInHouse: 'kitchen', 
              city: 'Portland' 
            })
            .then(res => {
              dataSessionId2 = res.body._id;
              return userAgent
              //hitting aggregation route
                .get(`/api/v1/auth/user-pi-data-sessions/${user._id}`)
                .then(res => {
                  console.log(res.body, 'this is the body');
                  console.log(dataSessionId1, dataSessionId2);
                  //expecting two sessions
                  expect(res.body).toEqual([{
                    _id: expect.any(String), 
                    piNicknameId: user.piNickname[0]._id, 
                    sensorType: 'light',
                    piLocationInHouse: 'kitchen',
                    city: 'Portland',
                    __v: 0,
                    dataSession: expect.any(String)
                  }, {
                    _id: expect.any(String), 
                    piNicknameId: user.piNickname[1]._id, 
                    sensorType: 'light',
                    piLocationInHouse: 'kitchen',
                    city: 'Portland',
                    __v: 0,
                    dataSession: expect.any(String)
                  }]);
                });
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


