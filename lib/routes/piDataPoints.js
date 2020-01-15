const { Router } = require('express');
const PiDataPoint = require('../models/PiDataPoint');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = Router()
  //raspberry pi will hit this route to post to the Mongo database
  .post('/', async(req, res, next) => {
    const piSessionToken = req.cookies.dataSession;
    let tokenPayload;
    try {
      tokenPayload = jwt.verify(piSessionToken, process.env.APP_SECRET);
      PiDataPoint
        .create({ ...req.body, piDataSessionId : tokenPayload._id })
        .then(data => {
          res.send(data);
        })
        .catch(next);
    }
    catch(err) {
      return err; 
    }
  });
