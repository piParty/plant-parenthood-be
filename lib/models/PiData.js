const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  raspberryPi: {
    type: String, 
    unique: [true, 'Raspberry pi id is taken'], 
    required: true
  }, 
  sensorType: {
    type: String, 
    enum: ['light', 'humidity'],
    required: true
  }, 
  value: {
    type: Number, 
    required: true
  }, 
  piLocationInHouse: {
    type: String, 
    required: true
  },
  //do we need this if we have the subdoc for piDataSchema in User model?
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  city: {
    type: String, 
    required: true
  },
  notes: String

  // //need a field (or virutal?) that is connected to a specific user's plant
  // plantId: 

}, {
  //everytime new datapoint it will use this model (most likely only the value field will be what we care about) --> attach a timestamp
  timestamps: true
});

module.exports = mongoose.model('Data', schema);
