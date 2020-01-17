const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const schema = new mongoose.Schema({
  piNicknameId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  sensorType: {
    type: [String],
    enum: ['light', 'humidity', 'temperature'],
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

  // //need a field (or virtual?) that is connected to a specific user's plant
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

schema.statics.getByLocation = function(piLocation) {
  return this.aggregate([
    {
      '$match': {
        'piLocationInHouse': piLocation
      }
    }
  ]);
};

schema.statics.getByCity = function(piCity) {
  return this.aggregate([
    {
      '$match': {
        'city': piCity
      }
    }
  ]);
};

schema.statics.getByNickname = function(nickname) {
  return this.aggregate([
    {
      '$match': {
        'piNickname': nickname
      }
    }
  ]);
};

schema.statics.getAggregateSensorDataByHour = function(piNicknameId, piLocationInHouse, nickname, city) {
  return this.aggregate([
    {
      '$match': {
        piLocationInHouse: piLocationInHouse,
        nickname: nickname,
        piNicknameId: piNicknameId,
        city: city
      }
    },
    {
      '$addFields': {
        'datetime': {
          '$dateFromString': {
            'dateString': '$datetime'
          }
        },
        'temperature': '$data.temperature',
        'humidity': '$data.humidity',
        'light': '$data.light'
      }
    }, {
      '$group': {
        '_id': '$datetime',
        'items': {
          '$push': '$$ROOT'
        }
      }
    }, {
      '$sort': {
        '_id': -1
      }
    }, {
      '$unwind': {
        'path': '$items'
      }
    }, {
      '$replaceRoot': {
        'newRoot': '$items'
      }
    }, {
      '$project': {
        '_id': 0,
        'light': 1,
        'temperature': 1,
        'humidity': 1,
        'hour': {
          '$hour': '$datetime'
        },
        'dayOfYear': {
          '$dayOfYear': '$datetime'
        },
        'datetime': 1
      }
    }, {
      '$group': {
        '_id': '$hour',
        'maxLight': {
          '$max': '$light'
        },
        'minLight': {
          '$min': '$light'
        },
        'avgLight': {
          '$avg': '$light'
        },
        'stdDeviationLight': {
          '$stdDevPop': '$light'
        },
        'maxTemperature': {
          '$max': '$temperature'
        },
        'minTemperature': {
          '$min': '$temperature'
        },
        'avgTemperature': {
          '$avg': '$temperature'
        },
        'stdDeviationTemperature': {
          '$stdDevPop': '$temperature'
        },
        'maxHumidity': {
          '$max': '$humidity'
        },
        'minHumidity': {
          '$min': '$humidity'
        },
        'avgHumidity': {
          '$avg': '$humidity'
        },
        'stdDeviationHumidity': {
          '$stdDevPop': '$humidity'
        }
      }
    }, {
      '$sort': {
        '_id': 1
      }
    }, {
      '$addFields': {
        'hour': '$_id'
      }
    }, {
      '$project': {
        '_id': 0
      }
    }
  ]);
};

module.exports = mongoose.model('PiDataSession', schema);
