const { Router } = require('express');
const PiDataPoint = require('../models/PiDataPoint');
const { ensureUserAuth } = require('../middleware/ensure-auth.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = Router()
  //raspberry pi will hit this route to post to the Mongo database
  // eslint-disable-next-line space-before-function-paren
  .post('/', ensureUserAuth, async (req, res, next) => {
    // console.log(req.headers);
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
  .get('/', (req, res, next) => {
    PiDataPoint
      .find()
      .then(dataPoints => {
        res.send(dataPoints);
      })
      .catch(next);
  })

  .get('/stats/by-hour/:id', ensureUserAuth, (req, res, next) => {
    PiDataPoint
      .getAggregateSensorDataByHour(req.params._id)
      .then(PiDataPoint => res.send(PiDataPoint))
      .catch(next);
  })

  .get('/stats/raw/:id', ensureUserAuth, (req, res, next) => {
    PiDataPoint
      .getRawData()
      .then(PiDataPoint => res.send(PiDataPoint))
      .catch(next);
  });
