const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  commonName: {
    type: String, 
    required: true,
    unique: [true, 'Plant name is already in database']
  }, 
  scientificName: {
    family: String, 
    genus: String, 
    species: String
  }, 
  waterPreference: String,

  sunlightPreference: {
    type: String,  
    enum: ['low', 'medium', 'high']
  }
});

module.exports = mongoose.model('Plant', schema);
