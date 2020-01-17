require('dotenv').config();
const { getUser, userAgent, adminAgent } = require('../lib/helpers/data-helpers');
const request = require('supertest');
const app = require('../lib/app');


describe('auth and user routes', () => {
  it('can signup a user via POST', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ 
        email: 'new@tess.com',  
        password: 'password', 
        role: 'user', 
        myPis: [{ piNickname: 'myFirstPi' }] 
      })
      .then(res => {
        expect(res.header['set-cookie'][0]).toEqual(expect.stringContaining('session='));
        expect(res.body).toEqual({
          _id: expect.any(String),
          email: 'new@tess.com',
          role: 'user',
          myPis: [{ piNickname: 'myFirstPi', _id: expect.any(String) }],
          __v: 0 
        });
      });
  });

  it('can login a user with email and password', async() => {
    const user = await getUser();
    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: user.email, password: 'password' })
      .then(res => {
        expect(res.header['set-cookie'][0]).toEqual(expect.stringContaining('session='));
        expect(res.body).toEqual({
          _id: user._id,
          email: user.email,
          role: 'user',
          myPis: [{ piNickname: 'userPi', _id: expect.any(String) }],
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

  it('should log out a user', async() => {
    return await userAgent
      .post('/api/v1/auth/logout')
      .then(res => {
        expect(res.header['set-cookie'][0]).toEqual(expect.stringContaining('session=;'));
      });
  });

  //check that existing pis are not deleted
  it('can patch a user', async() => {
    const user = await getUser();
    return request(app)
      .patch(`/api/v1/auth/${user._id}`)
      .send({ password: 'notPasswordAnymore', myPis: { piNickname: 'MyFirstPi' } })
      .then(res => {
        expect(res.body).toEqual({
          _id: user._id.toString(),
          email: user.email,
          role: 'user',
          myPis: [{ _id: expect.any(String), piNickname: 'MyFirstPi' }],
          __v: 0
        });
      });
  });

  it('can update a users Pis', async() => {
    const userInfoOfAgent = await getUser({ email:'user0@tess.com' });
    const initialPis = userInfoOfAgent.myPis;
    return userAgent
      .patch(`/api/v1/auth/myPis/${userInfoOfAgent._id}`)
      .send({ piNickname: 'mySecondPi' })
      .then(res => {
        expect(res.body).toEqual({
          ...userInfoOfAgent,
          myPis: [...initialPis, { _id: expect.any(String), piNickname: 'mySecondPi' }]
        });
      });
  });

  it('should throw an error when a user tries to delete a user', async() => {
    const deleteMe = await getUser();

    return userAgent
      .delete(`/api/v1/auth/${deleteMe._id}`)
      .then(res => {
        expect(res.status).toEqual(403);
        expect(res.body.message).toEqual('Admin role required.');
      });
  });

  it('should only allow an admin to delete a user', async() => {
    const deleteMe = await getUser();
    return adminAgent
      .delete(`/api/v1/auth/${deleteMe._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: deleteMe._id,
          email: deleteMe.email,
          role: 'user',
          myPis: [{ piNickname: 'userPi', _id: expect.any(String) }],
          __v: 0
        });
      });
  });
});
