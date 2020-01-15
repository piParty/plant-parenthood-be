const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  piDataSessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PiDataSession', 
    required: true
  },
  data: {
    type:Object,
    required: true
  }, 
  piTimestamp: {
    type: Date, 
    required: true
  }
});

module.exports = mongoose.model('PiDataPoint', schema);
