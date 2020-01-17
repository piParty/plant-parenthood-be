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

  .patch('/:id', (req, res, next) => {
    User
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(user => res.send(user))
      .catch(next);
  })

  //route for changing the role field ONLY
  .patch('/change-role/:id', ensureAdminAuth, (req, res, next) => {
    if(req.body.role) {
      const err = new Error({
        message: 'route for chaning role only'
      });
      throw err;
    }
    User
      .findById(req.params.id)
      .updateMany()
      .then(user => res.send(user))
      .catch(next);
  })

  .post('/logout', (req, res) => {
    res.clearCookie('session', {
      maxAge: MAX_AGE_IN_MS
    });
    res.send();
  })

  .delete('/:id', ensureAdminAuth, (req, res, next) => {
    User
      .findByIdAndDelete(req.params.id)
      .then(user => res.send(user))
      .catch(next);
  });

//get all route for admin to see all the users with an array of pis 

// .get('/verify-user', ensureUserAuth, (req, res) => {
//   res.send(req.user);
// })

// .get('/verify-admin', ensureAdminAuth, (req, res) => {
//   res.send(req.user);
// });
