const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  averageValue: {
    type: Number, 
    required: true
  }, 
  standardDeviation: {
    type: Number, 
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PiDataPoint', schema);
