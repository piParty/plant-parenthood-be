const { Router } = require('express');
const PiDataSession = require('../models/PiDataSession.js');
const { ensureUserAuth, ensureAdminAuth } = require('../middleware/ensure-auth.js');

module.exports = Router()
  .post('/', ensureUserAuth, (req, res, next) => {
    PiDataSession
      .create(req.body)
      .then(session => {
        // res.cookie('dataSession', session.dataSessionToken(), {
        //   maxAge: 10 * 365 * 24 * 60 * 60 * 1000
        // });
        const dataSession = session.dataSessionToken();
        res.send({ ...session.toJSON(), dataSession });
      })
      .catch(next);
  })

  .get('/location/:location', (req, res, next) => {
    const piLocation = req.params.location;
    PiDataSession
      .getByLocation(piLocation)
      .then(sessions => res.send(sessions))
      .catch(next);
  })

  .get('/city/:city', (req, res, next) => {
    const city = req.params.city;
    PiDataSession
      .getByCity(city)
      .then(sessions => res.send(sessions))
      .catch(next);
  })

  .get('/nickname/:nickname', (req, res, next) => {
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
        console.log(req.params);
        res.send(session);
      })
      .catch(next);
  })
  
//should be admin only
  .get('/', ensureAdminAuth, (req, res, next) => {
    PiDataSession
      .find()
      .then(sessions => res.send(sessions))
      .catch(next);
  })

  .get('/user-sessions', ensureUserAuth, (req, res, next) => {
    // it's possible that req.user will contain the current user
    // first get userAuthtoken from cookies?
    // verify token?
    // use tokenPayload to idenitfy user?
    const userAuthToken = req.cookies;
    // identify user and then user's piNickNames...
    //  PiDataSession

  //    .find({ piNickname: })
  })

//another get all route for getting all per user

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
