require('dotenv').config();
const { userAgent, getUser, getPiDataSessions } = require('../lib/helpers/data-helpers.js');
const chance = require('chance')();

describe('Aggregation tests for piDataSession routes', () => {

  it('should be able to get all of a users data sessions by city', async() => {
    //get the user information of userAgent
    const user = await getUser({ email: 'user0@tess.com' });
    //get all of their pis
    const userPiIds = user.myPis.map(pi => pi._id);
    //Must promise.all getting the sesions in case there are multiple pies
    const sessions = await Promise.all(userPiIds.map(async(id) => await getPiDataSessions({ piNicknameId: id })));
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
            piNicknameId: session._id.toString(),
            sensorType: session.sensorType,
            piLocationInHouse: session.piLocationInHouse,
            city: cityFromASession,
            __v: 0
          });
        });
      });

  });

  it('should be able to get all of a users data sessions by location in house', () => {

  });

  it('should be able to get all of a users data sessions by piNickname', () => {

  });
});
