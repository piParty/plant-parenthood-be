require('dotenv').config();

const { getUser } = require('../lib/helpers/data-helpers');
const request = require('supertest');
const app = require('../lib/app');


describe('app routes', () => {
  it('can signup a user via POST', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ email: 'new@tess.com',  password: 'password', role: 'user' })
      .then(res => {
        expect(res.header['set-cookie'][0]).toEqual(expect.stringContaining('session='));
        expect(res.body).toEqual({
          _id: expect.any(String),
          email: 'new@tess.com',
          role: 'user',
          myPis: [],
          __v: 0 
        });
      });
  });

  it('can login a user with email and password', async() => {
    const user = await getUser();
    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'user@tess.com', password: 'password' })
      .then(res => {
        expect(res.header['set-cookie'][0]).toEqual(expect.stringContaining('session='));
        expect(res.body).toEqual({
          _id: user._id,
          email: 'user@tess.com',
          role: 'user',
          myPis: [],
          __v: 0
        });
      });
  });

  it('fails to login a user with a bad email', async() => {
    await getUser();
    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'badEmail@notgood.io', password: 'password' })
      .then(res => {
        expect(res.status).toEqual(401);
        expect(res.body).toEqual({
          status: 401,
          message: 'Invalid Email or Password'
        });
      });
  });

  it('fails to login a user with a bad password', async() => {
    await getUser();
    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'user@tess.com', password: 'notright' })
      .then(res => {
        expect(res.status).toEqual(401);
        expect(res.body).toEqual({
          status: 401,
          message: 'Invalid Email or Password'
        });
      });
  });

});
