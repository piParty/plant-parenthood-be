const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  commonName: {
    type: String, 
    required: true
  }, 
  scientificName: {
    family: String, 
    genus: String, 
    species: String
  }, 
  waterPreference: {
    type: String, 
    required: true
  },
  sunlightPreference: {
    type: String, 
    required: true
  }
  // userId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User', 
  //   required: true
  // },
  // raspberryPiId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User', 
  //   required: true
  // }
  
});

module.exports = mongoose.model('Plant', schema);
