const { Router } = require('express');
const PiDataSession = require('../models/PiDataSession.js');
const { ensureUserAuth } = require('../middleware/ensure-auth.js');

module.exports = Router()
  .post('/', ensureUserAuth, (req, res, next) => {
    PiDataSession
      .create(req.body)
      .then(session => {
        res.cookie('dataSession', session.dataSessionToken(), {
          maxAge: 10 * 365 * 24 * 60 * 60 * 1000
        });
        res.send(session);
      })
      .catch(next);
  })

  .get('/:id', ensureUserAuth, (req, res, next) => {
    PiDataSession
      .findById(req.params.id)
      .then(session => res.send(session))
      .catch(next);
  })
  
//should be admin only
//another route for getting all per user
  .get('/', ensureUserAuth, (req, res, next) => {
    PiDataSession
      .find()
      .then(sessions => res.send(sessions))
      .catch(next);
  })

  .patch('/:id', ensureUserAuth, (req, res, next) => {
    PiDataSession
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(session => res.send(session))
      .catch(next);
  })

  .delete('/:id', ensureUserAuth, (req, res, next) => {
    PiDataSession
      .findByIdAndDelete(req.params.id)
      .then(session => res.send(session))
      .catch(next);
  });
