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
    // use destructuring
    const { city, userId} = req.params;

    User
      .getUserSessionsByCity(city, userId)
      .then(sessions => {
        const toSend = sessions.map(session => {
          return session.sessions;
        });
        res.send(toSend);
      })
      .catch(next);
  })

  .get('/location/:location&:userId', ensureUserAuth, (req, res, next) => {
    const { piLocation, userId } = req.params;

    User
      .getUserSessionsByLocation(piLocation, userId)
      .then(sessions => {
        const toSend = sessions.map(session => {
          return session.sessions;
        });
        res.send(toSend);
      })
      .catch(next);
  })

  .get('/nickname/:nickname&:userId', ensureUserAuth, (req, res, next) => {
    const { nickname, userId } = req.params;
    
    User
      .getUserSessionsByPiNickname(nickname, userId)
      .then(sessions => {
        const toSend = sessions.map(session => {
          return session.sessions;
        });
        res.send(toSend);
      })
      .catch(next);
  });
