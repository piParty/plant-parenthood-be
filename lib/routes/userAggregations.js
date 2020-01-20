const { Router } = require('express');
const User = require('../models/User');
const { ensureUserAuth } = require('../middleware/ensure-auth');

module.exports = Router()
  //aggregating data sessions by a specific user
  .get('/user-pi-data-sessions/:id', ensureUserAuth, (req, res, next) => {
    User
      .getAllSessionsByUser()
      .then(sessions => res.send(sessions))
      .catch(next);
  });
 
    //route for getting all sessions by user --> aggregation with two unwinds
  // .get('/user-sessions', ensureUserAuth, (req, res, next) => {
  //   // it's possible that req.user will contain the current user
  //   // first get userAuthtoken from cookies?
  //   // verify token?
  //   // use tokenPayload to idenitfy user?
  //   // identify user and then user's piNickNames...
  //   //  PiDataSession

  // //    .find({ piNickname: })
  // })
