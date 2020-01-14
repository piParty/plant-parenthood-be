const { Router } = require('express');
const PiDataSession = require('../models/PiDataSession.js');

module.exports = Router()
  .post('/', (req, res, next) => {
    PiDataSession
      .create(req.body)
      .then(session => res.send(session))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    PiDataSession
      .findById(req.params.id)
      .then(session => res.send(session))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    PiDataSession
      .find()
      .then(sessions => res.send(sessions))
      .catch(next);
  })

  .patch('/:id', (req, res, next) => {
    PiDataSession
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(session => res.send(session))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    PiDataSession
      .findByIdAndDelete(req.params.id)
      .then(session => res.send(session))
      .catch(next);
  });
