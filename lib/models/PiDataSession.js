const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const schema = new mongoose.Schema({
  piNickname: {
    type: String, 
    unique: [true, 'Raspberry pi nickname is taken'], 
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

schema.statics.findByToken = function(token) {
  try {
    const tokenPayload = jwt.verify(token, process.env.APP_SECRET);
    return Promise.resolve(this.hydrate({
      _id: this._id,
      piNickname: tokenPayload.piNickname,
    }));
  }
  catch(err) {
    return Promise.reject(err);
  }
};

module.exports = mongoose.model('PiDataSession', schema);
