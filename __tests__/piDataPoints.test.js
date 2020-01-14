require('dotenv').config();

const { getUser } = require('../lib/helpers/data-helpers');
const request = require('supertest');
const app = require('../lib/app');


describe('app routes', () => {
  it('should be able to verify a session and post a data point', () => {
    return request(app)
      .post('/dataPoints', {
        averageValue: 4,
        standardDeviation: 1,
        piTimestamp: Date.now()
      })
      .then(res => {
        expect(res.body).toEqual({
          __v: 0,
          averageValue: 4,
          standardDeviation: 1,
          piTimestamp: res.piTimestamp
        });
      });
  
  });
});
