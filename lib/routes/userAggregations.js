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
 
