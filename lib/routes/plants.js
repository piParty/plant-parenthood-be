const { Router } = require('express');
const Plant = require('../models/Plant');

module.exports = Router()
  .post('/', (req, res, next) => {
    Plant
      .create(req.body)
      .then(plant => res.send(plant))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Plant
      .find()
      .then(plants => res.send(plants))
      .catch(next);
  });
