const { Router } = require('express');
const User = require('../models/User');
const { ensureUserAuth } = require('../middleware/ensure-auth');

module.exports = Router()
  //aggregating data sessions by a specific user
  .get('/user-pi-data-sessions/:userId', ensureUserAuth, (req, res, next) => {
    const userId = req.params.userId;

    User
      .getAllSessionsByUser(userId)
      .then(sessions => res.send(sessions))
      .catch(next);
  });
  