require('dotenv').config();
const { getUser, userAgent, adminAgent, getPiDataSessions } = require('../lib/helpers/data-helpers');
const request = require('supertest');
const app = require('../lib/app');
const chance = require('chance')();


describe('user aggregation route tests', () => {
  it.skip('can aggregate all data sessions by user', () => {
   
  });

});

describe('Aggregation tests for piDataSession routes', () => {

  let user;
  let userPiIds;
  let sessions;
  beforeEach(async() => {
    //get the user information of userAgent
    user = await getUser({ email: 'user0@tess.com' });
    //get all of their pis ids
    userPiIds = user.myPis.map(pi => pi._id);
    //Must promise.all getting the sesions in case there are multiple pies
    sessions = await Promise.all(userPiIds.map(async(id) => await getPiDataSessions({ piNicknameId: id })));
  });

  it('should be able to get all of a users data sessions by city', async() => {
    const cityFromASession = chance.pickone(sessions[0]).city;
    const sessionsOfCity = await getPiDataSessions({ city: cityFromASession });
    
    return userAgent
      //pick a city to get sessions for.
      .get(`/api/v1/user-aggregations/city/${cityFromASession}&${user._id}`)
      .then(res => {
        sessionsOfCity.forEach(session => {
          expect(res.body).toContainEqual({
            _id: expect.any(String),
            piNicknameId: session.piNicknameId.toString(),
            sensorType: session.sensorType,
            piLocationInHouse: session.piLocationInHouse,
            city: cityFromASession,
            __v: session.__v
          });
        });
      });
  });

  it.only('should be able to get all of a users data sessions by location in house', async() => {
    const locationFromASession = chance.pickone(sessions[0]).piLocationInHouse;
    const sessionsOfLocation = await getPiDataSessions({ piLocationInHouse: locationFromASession });

    return userAgent
      .get(`/api/v1/user-aggregations/location/${locationFromASession}&${user._id}`)
      .then(res => {
        sessionsOfLocation.forEach(session => {
          expect(res.body).toContainEqual({
            _id: expect.any(String),
            piNicknameId: session.piNicknameId.toString(),
            sensorType: session.sensorType,
            piLocationInHouse: locationFromASession,
            city: session.city,
            __v: session.__v
          });
        });
      });
  });

  it('should be able to get all of a users data sessions by piNickname', async() => {
    const singlePiOfUser = chance.pickone(user.myPis);
    const singlePiNicknameOfUser = singlePiOfUser.piNickname;
    const singlePiIdOfUser = singlePiOfUser._id;
    const sessionsOfPiNickname = await getPiDataSessions({ piNicknameId: singlePiIdOfUser });
    console.log(sessionsOfPiNickname);

    return userAgent
      .get(`/api/v1/pi-data-sessions/nickname/${singlePiNicknameOfUser}`)
      .then(res => {
        sessionsOfPiNickname.forEach(session => {
          expect(res.body).toContainEqual({
            _id: expect.any(String),
            piNicknameId: singlePiIdOfUser,
            sensorType: session.sensorType,
            piLocationInHouse: session.piLocationInHouse,
            city: session.city,
            __v: session.__v
          });
        });
      });
  });
});