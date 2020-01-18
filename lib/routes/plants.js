const { Router } = require('express');
const Plant = require('../models/Plant');
const { ensureAdminAuth } = require('../middleware/ensure-auth');

module.exports = Router()
  .post('/', ensureAdminAuth, (req, res, next) => {
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
  })
  
  .get('/light/:type', (req, res, next) => {
    Plant
      .find({ sunlightPreference: req.params.type })
      .then(plants => res.send(plants))
      .catch(next);
  }) 

  .get('/:id', (req, res, next) => {
    Plant
      .findById(req.params.id)
      .then(plant => res.send(plant))
      .catch(next);
  })

  .patch('/:id', ensureAdminAuth, (req, res, next) => {
    Plant
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(plant => res.send(plant))
      .catch(next);
  })
  
  .delete('/:id', ensureAdminAuth, (req, res, next) => {
    Plant
      .findByIdAndDelete(req.params.id)
      .then(plant => res.send(plant))
      .catch(next);
  });
