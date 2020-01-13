const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  piDataSessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PiDataSession', 
    required: true
  },
  averageValue: {
    type: Number, 
    required: true
  }, 
  standardDeviation: {
    type: Number, 
    required: true
  }, 
  piTimestamp: {
    type: Date, 
    required: true
  }
});

module.exports = mongoose.model('PiDataPoint', schema);
