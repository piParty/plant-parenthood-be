const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

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

schema.methods.dataSessionToken = function() {
  return jwt.sign(this.toJSON(), process.env.APP_SECRET, {
    expiresIn: '1y'
  });
};

module.exports = mongoose.model('PiDataSession', schema);
