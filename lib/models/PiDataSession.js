const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const schema = new mongoose.Schema({
  piNicknameId: {
    type: mongoose.Schema.Types.ObjectId, 
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

schema.virtual('user', { 
  ref: 'User',
  localField: 'piNickNameId',
  foreignField: 'myPis._id'
});

// schema.methods.piNickname = function() {
//   return this.model('User').findOne({ 'myPis._id': this.piNicknameId })
//     .then(user => {
//       return user.myPis.find(pi => pi._id === this.piNicknameId);
//     });
// };

schema.methods.dataSessionToken = function() {
  return jwt.sign(this.toJSON(), process.env.APP_SECRET, {
    expiresIn: '1y'
  });
};


module.exports = mongoose.model('PiDataSession', schema);
