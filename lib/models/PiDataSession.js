const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  piNickname: {
    type: String, 
    unique: [true, 'Raspberry pi nickname is taken'], 
    required: true
  }, 
  sensorType: {
    type: String, 
    enum: ['light', 'humidity'],
    required: true
  }, 
  piLocationInHouse: {
    type: String, 
    required: true
  },
  city: {
    type: String, 
    required: true
  },
  notes: String

  // //need a field (or virutal?) that is connected to a specific user's plant
  // plantId: 

});

module.exports = mongoose.model('PiDataSession', schema);
