const inquirer = require('inquirer');
const User = require('./lib/models/User');
const PiDataSession = require('./lib/models/PiDataSession');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./lib/app');

let answers = {
  IPAddress : '1234',
  nickName: 'Thing',
  sensors: 'light',
  piLocationInHouse: 'by Window',
  city: 'Portland',
  email: 'me@me.com',
  appPassword: '1234567'
};
describe('post to data sessions and initiate collecting user data', () => {
  it('should post a user', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ 
        email: answers.email,  
        password: answers.password, 
        role: 'user'
      })
      .then(res => {
        expect(res.body).toEqual({
          __v: 0,
          _id: expect.any(mongoose.Types.ObjectId),
          email: answers.email,
          myPis: [],
          role: 'user'
        });
      });
  });
  
  
  // const user = await  User.create({
  //   email: 'mealso@menubar.com',
  //   password: '1234567890',
  //   role: 'user',
  //   myPis: [{ piNickname : 'Abe' }]
  // });
  it('should post a session', () => {
    return request(app)
      .post('/api/v1/piDataSessions')
      .send({
        piNickname: 'Abe', 
        sensorType: answers.sensors,
        piLocationInHouse: answers.piLocationInHouse,
        city: answers.city
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: res.body._id.toString(),
          piNickname: 'Abe',
          sensorType: 'light',
          piLocationInHouse: 'by Window',
          city: 'Portland',
          __v: 0
        });
        expect(res.body.cookies).toEqual('');
      });
  });
});
//       const piCookie = dataSesssion.cookies;
//       expect(newUser).toEqual({
//         __v: 0,
//         _id: expect.any(mongoose.Types.ObjectId),
//         email: answers.email,
//         role: 'user' 
//       });
//       expect(dataSesssion).toEqual({
//         __v: 0,
//         _id: expect.any(mongoose.Types.ObjectId),
//         piNickname: answers.nickName, 
//         sensorType: answers.sensors,
//         piLocationInHouse: answers.piLocationInHouse,
//         city: answers.city
//       });
//       expect(piCookie).toEqual('');
//     };
//   });
