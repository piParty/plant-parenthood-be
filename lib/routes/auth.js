const { Router } = require('express');
const { ensureUserAuth, ensureAdminAuth } = require('../middleware/ensure-auth');
const User = require('../models/User');

const MAX_AGE_IN_MS = 24 * 60 * 60 * 1000;

// some middleware like this could be handy if you want to validate
// request bodies
const requiredFields = fields => (req, res, next) => {
  const missingFields = fields.reduce((missing, field) => {
    if(!(field in req.body)) missing.push(field);

    return missing
  }, []);

  if(missingFields.length > 0) return next(new Error(`${missingFields.join(', ')} required in body`));

  next();
}

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

  //can only add one pi at a time.
  // Not awaiting anything so no need to make this async
  .patch('/myPis/:id', ensureUserAuth, requiredFields(['piNickname']), (req, res, next) => {
    User
      .findByIdAndUpdate(req.params.id, { $push: { myPis: req.body } }, { new: true })
      .then(user => res.send(user))
      .catch(next);
  })

  //route for changing the role field ONLY
  .patch('/change-role/:id', ensureAdminAuth, requiredFields(['role']), (req, res, next) => {
    User
      .findOneAndUpdate({ _id: req.params.id }, { role: req.body.role }, { new: true })
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
