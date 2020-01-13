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
    required: true, 
    enum: ['low', 'medium', 'high']
  }
});

module.exports = mongoose.model('Plant', schema);
