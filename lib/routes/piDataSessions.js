const { Router } = require('express');
const PiDataSession = require('../models/PiDataSession.js');
const { ensureUserAuth, ensureAdminAuth } = require('../middleware/ensure-auth.js');

module.exports = Router()
  .post('/', ensureUserAuth, (req, res, next) => {
    PiDataSession
      .create(req.body)
      .then(session => {
        const dataSession = session.dataSessionToken();
        res.send({ ...session.toJSON(), dataSession });
      })
      .catch(next);
  })

  .get('/location/:location', ensureUserAuth, (req, res, next) => {
    const piLocation = req.params.location;
    PiDataSession
      .getByLocation(piLocation)
      .then(sessions => res.send(sessions))
      .catch(next);
  })

  .get('/city/:city', ensureUserAuth, (req, res, next) => {
    const city = req.params.city;
    PiDataSession
      .getByCity(city)
      .then(sessions => res.send(sessions))
      .catch(next);
  })

  .get('/nickname/:nickname', ensureUserAuth, (req, res, next) => {
    const nickname = req.params.nickname;
    PiDataSession
      .getByNickname(nickname)
      .then(sessions => res.send(sessions))
      .catch(next);
  })

  .get('/:id', ensureUserAuth, (req, res, next) => {
    PiDataSession
      .findById(req.params.id)
      .then(session => {
        res.send(session);
      })
      .catch(next);
  })

  .get('/', ensureAdminAuth, (req, res, next) => {
    PiDataSession
      .find()
      .then(sessions => res.send(sessions))
      .catch(next);
  })

  .patch('/:id', ensureUserAuth, (req, res, next) => {
    PiDataSession
      .findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .then(session => res.send(session))
      .catch(next);
  })

  .delete('/:id', ensureUserAuth, (req, res, next) => {
    PiDataSession
      .findByIdAndDelete(req.params.id)
      .then(session => res.send(session))
      .catch(next);
  });
