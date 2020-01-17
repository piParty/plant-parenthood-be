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

schema.statics.getLowLightPlants = function(){
  return this.aggregate([
    {
      '$match': {
        'sunlightPreference': 'low'
      }
    }
  ]);
};

schema.statics.getMediumLightPlants = function(){
  return this.aggregate([
    {
      '$match': {
        'sunlightPreference': 'medium'
      }
    }
  ]);
};

schema.statics.getHighLightPlants = function(){
  return this.aggregate([
    {
      '$match': {
        'sunlightPreference': 'high'
      }
    }
  ]);
};

module.exports = mongoose.model('Plant', schema);
