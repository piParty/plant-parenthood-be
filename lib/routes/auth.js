const { Router } = require('express');
const { ensureUserAuth, ensureAdminAuth } = require('../middleware/ensure-auth');
const User = require('../models/User');

const MAX_AGE_IN_MS = 24 * 60 * 60 * 1000;

const setSessionCookie = (res, token) => {
  res.cookie('session', token, {
    maxAge: MAX_AGE_IN_MS
  });
};

module.exports = Router()

  .post('/signup', (req, res, next) => {
    User
      .create(req.body)
      .then(user => {
        setSessionCookie(res, user.authToken());
        res.send(user);
      })
      .catch(next);
  })

  .post('/login', (req, res, next) => {
    User
      .authorize(req.body)
      .then(user => {
        setSessionCookie(res, user.authToken());
        res.send(user);
      })
      .catch(next);
  })

  .post('/logout', (req, res) => {
    res.clearCookie('session', {
      maxAge: MAX_AGE_IN_MS
    });
    res.send();
  });

  //e.g. to add another pi, if admin--> update role of user?
  // .patch('/update-user', ensureUserAuth, ensureAdminAuth, (req, res) => {
  //   res.send(req.user);
  // })

  //get all route for admin to see all the users with an array of pis 

  //delete a user route for admin only
  //.

  // .get('/verify-user', ensureUserAuth, (req, res) => {
  //   res.send(req.user);
  // })

  // .get('/verify-admin', ensureAdminAuth, (req, res) => {
  //   res.send(req.user);
  // });
