const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const myPiSchema = new mongoose.Schema({
  description: String, 
  piNickname: {
    type: String, 
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
    required: true,
    enum: ['admin', 'user'],
    default: 'user'
  }, 
  myPis: [myPiSchema],
}, {
  toJSON: {
    transform: (doc, ret) => {
      delete ret.passwordHash;
    }
  }
});

//connect a user with the plants that they have
schema.virtual('myPlants', {
  ref: 'Plant', 
  localField: '_id', 
  foreignField: 'user'
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
