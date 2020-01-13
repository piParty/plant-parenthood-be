const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  sensorType: {
    type: String, 
    required: true
  }, 
  value: {
    type: Number, 
    required: true
  }, 
  locationInHouse: {
    type: String, 
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  raspberryPiId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  }
  
}, {
  timestamps: true
});

module.exports = mongoose.model('Data', schema);
