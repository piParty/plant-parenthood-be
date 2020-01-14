const { Router } = require('express');
const PiDataPoint = require('../models/PiDataPoint');
const PiDataSession = require('../models/PiDataSession');

module.exports = Router()
  .post('/', async(req, res, next) => {
    const data = req.body;
    const piSessionCookie = req.cookies.piSessionCookie;
    const validSession = await PiDataSession
      .findByToken(piSessionCookie);
    PiDataPoint
      .create({ ...data, piDataSessionId : validSession._id })
      .then(data => {
        res.send(data);
      })
      .catch(next);
  });
