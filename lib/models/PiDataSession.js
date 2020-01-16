const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const schema = new mongoose.Schema({
  piNicknameId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  }, 
  sensorType: {
    type: [String], 
    enum: ['light', 'light HDR', 'humidity', 'temperature', 'pH', 'soil moisture', 'CO2', 'oxygen'],
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
