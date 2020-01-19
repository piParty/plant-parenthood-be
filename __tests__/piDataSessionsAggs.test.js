require('dotenv').config();
const { userAgent, getUser, getPiDataSessions } = require('../lib/helpers/data-helpers.js');
const chance = require('chance')();

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
    console.log(sessionsOfCity);
    
    return userAgent
      //pick a city to get sessions for.
      .get(`/api/v1/piDataSessions/city/${cityFromASession}`)
      .then(res => {
        sessionsOfCity.forEach(session => {
          expect(res.body).toContainEqual({
            _id: expect.any(String),
            piNicknameId: session.piNicknameId.toString(),
            sensorType: session.sensorType,
            piLocationInHouse: session.piLocationInHouse,
            city: cityFromASession,
            __v: 0
          });
        });
      });

  });

  it('should be able to get all of a users data sessions by location in house', async() => {
    const locationFromASession = chance.pickone(sessions[0]).piLocationInHouse;
    const sessionsOfLocation = await getPiDataSessions({ piLocationInHouse: locationFromASession });
    console.log(sessionsOfLocation);

    return userAgent
      .get(`/api/v1/piDataSessions/location/${locationFromASession}`)
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

  it('should be able to get all of a users data sessions by piNickname', () => {

  });
});
