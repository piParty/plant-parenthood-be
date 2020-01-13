const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const plantSchema = new mongoose.Schema({
  description: String, 
  plant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant', 
    required: true
  }
});

const schema = new mongoose.Schema({
  email: {
    type: String, 
    required: true, 
    unique: [true, 'Email is taken']
  }, 
  passwordHash: {
    type: String, 
    required: true
  }, 
  role: {
    type: String, 
    enum: ['admin', 'user'],
    default: 'user'
  }, 
  location: {
    type: String, 
    required: true
  },
  raspberryPi: {
    type: String, 
    unique: [true, 'Raspberry pi id is taken'], 
    required: true
  }, 
  myPlants: [plantSchema]
}, {
  toJSON: {
    transform: (doc, ret) => {
      delete ret.passwordHash;
    }
  }
});

schema.virtual('password').set(function(password) {
  this.passwordHash = bcrypt.hashSync(password, 10);
});


schema.statics.findByToken = function(token) {
  try {
    const tokenPayload = jwt.verify(token, process.env.APP_SECRET);
    return Promise.resolve(this.hydrate({
      _id: tokenPayload._id,
      email: tokenPayload.email,
      role: tokenPayload.role,
      __v : tokenPayload.__v
    }));
  }
  catch(err) {
    return Promise.reject(err);
  }
};

schema.methods.authToken = function() {
  return jwt.sign(this.toJSON(), process.env.APP_SECRET, {
    expiresIn: '24h'
  });
};

schema.statics.authorize = async function({ email, password }) {
  const user = await this.findOne({ email });
  if(!user) {
    const err = new Error('Invalid Email or Password');
    err.status = 401;
    throw err;
  }
  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if(!validPassword) {
    const err = new Error('Invalid Email or Password');
    err.status = 401;
    throw err;
  }
  return user;
};

module.exports = mongoose.model('User', schema);
