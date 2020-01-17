const { Router } = require('express');
const PiDataPoint = require('../models/PiDataPoint');
const { ensureUserAuth } = require('../middleware/ensure-auth.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = Router()
  //raspberry pi will hit this route to post to the Mongo database
  .post('/', ensureUserAuth, async(req, res, next) => {
    const piSessionToken = req.headers.datasession;
    let tokenPayload;
    try {
      tokenPayload = jwt.verify(piSessionToken, process.env.APP_SECRET);
      PiDataPoint
        .create({ ...req.body, piDataSessionId: tokenPayload._id })
        .then(data => {
          res.send(data);
        })
        .catch(next);
    }
    catch(err) {
      return err;
    }
  })

  //Pretty much only for testing purposes.
  .get('/', ensureUserAuth, (req, res, next) => {
    PiDataPoint
      .find()
      .then(dataPoints => {
        res.send(dataPoints);
      })
      .catch(next);
  })

  .get('/stats/by-hour', ensureUserAuth, (req, res, next) => {
    PiDataPoint
      .getAggregateSensorDataByHour()
      .then(PiDataPoint => res.send(PiDataPoint))
      .catch(next);
  })

  .get('/stats/raw', ensureUserAuth, (req, res, next) => {
    PiDataPoint
      .getRawData()
      .then(PiDataPoint => res.send(PiDataPoint))
      .catch(next);
  })

  .get('/:sessionId', ensureUserAuth, (req, res, next) => {
    PiDataPoint
      .find({ piDataSessionId: req.params.sessionId })
      .then(res => {
        console.log(res);
      })
      .catch(next);
  });
