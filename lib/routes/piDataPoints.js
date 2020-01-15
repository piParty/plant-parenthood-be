const { Router } = require('express');
const PiDataPoint = require('../models/PiDataPoint');
const PiDataSession = require('../models/PiDataSession');

module.exports = Router()
  //raspberry pi will hit this route to post to the Mongo database
  .post('/', async(req, res, next) => {
    const piSessionCookie = req.cookies.dataSession;
    const validSession = await PiDataSession
      .findBySessionToken(piSessionCookie);

    PiDataPoint
      .create({ ...req.body, piDataSessionId : validSession._id })
      .then(data => {
        res.send(data);
      })
      .catch(next);
  });
