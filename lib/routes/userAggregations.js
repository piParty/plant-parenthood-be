const { Router } = require('express');
const User = require('../models/User');
const { ensureUserAuth } = require('../middleware/ensure-auth');

module.exports = Router()
  //aggregating data sessions by a specific user
  // .get('/data-session/:id', ensureUserAuth, (req, res, next) => {
  //   User
  //     .etAllSessionsByUser()
  //     .then(sessions => res.send(sessions))
  //     .catch(next);
  // });
 
  .get('/city/:city&:userId', ensureUserAuth, (req, res, next) => {
    const city = req.params.city;
    const userId = req.params.userId;
    User
      .getByCity(city, userId)
      .then(sessions => {
        const toSend = sessions.map(session => {
          console.log(session.sessions);
          return session.sessions;
        });
        res.send(toSend);
      })
      .catch(next);
  })
