const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  piDataSessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PiDataSession',
    required: true
  },
  data: {
    type: Object,
    required: true
  },
  piTimestamp: {
    type: Date,
    required: true
  }
});


schema.statics.getAggregateSensorDataByHour = function(sessionId) {
  return this.aggregate([
    {
      '$match': {
        'piDataSessionId': sessionId
      }
    }, {
      '$addFields': {
        'datetime': '$piTimestamp',
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
      '$addFields': {
        'lightAverage': '$data.light.averageValue',
        'lightStandardDeviation': '$data.light.standardDeviation',
        'humidityAverage': '$data.humidity.averageValue',
        'humidityStandardDeviation': '$data.humidity.standardDeviation',
        'temperatureAverage': '$data.temperature.averageValue',
        'temperatureStandardDeviation': '$data.temperature.standardDeviation'
      }
    }, {
      '$project': {
        '_id': 0,
        'lightAverage': 1,
        'lightStandardDeviation': 1,
        'humidityAverage': 1,
        'humidityStandardDeviation': 1,
        'temperatureAverage': 1,
        'temperatureStandardDeviation': 1,
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
          '$max': '$lightAverage'
        },
        'minLight': {
          '$min': '$lightAverage'
        },
        'avgLight': {
          '$avg': '$lightAverage'
        },
        'stdDeviationLight': {
          '$stdDevPop': '$lightAverage'
        },
        'maxTemperature': {
          '$max': '$temperatureAverage'
        },
        'minTemperature': {
          '$min': '$temperatureAverage'
        },
        'avgTemperature': {
          '$avg': '$temperatureAverage'
        },
        'stdDeviationTemperature': {
          '$stdDevPop': '$temperatureAverage'
        },
        'maxHumidity': {
          '$max': '$humidityAverage'
        },
        'minHumidity': {
          '$min': '$humidityAverage'
        },
        'avgHumidity': {
          '$avg': '$humidityAverage'
        },
        'stdDeviationHumidity': {
          '$stdDevPop': '$humidityAverage'
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



schema.statics.getRawData = function(sessionId) {
  return this.aggregate([
    {
      '$match': {
        'piDataSessionId': sessionId
      }
    }, {
      '$addFields': {
        'datetime': '$piTimestamp',
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
      '$addFields': {
        'lightAverage': '$data.light.averageValue',
        'lightStandardDeviation': '$data.light.standardDeviation',
        'humidityAverage': '$data.humidity.averageValue',
        'humidityStandardDeviation': '$data.humidity.standardDeviation',
        'temperatureAverage': '$data.temperature.averageValue',
        'temperatureStandardDeviation': '$data.temperature.standardDeviation'
      }
    }, {
      '$project': {
        '_id': 0,
        'lightAverage': 1,
        'lightStandardDeviation': 1,
        'humidityAverage': 1,
        'humidityStandardDeviation': 1,
        'temperatureAverage': 1,
        'temperatureStandardDeviation': 1,
        'hour': {
          '$hour': '$datetime'
        },
        'dayOfYear': {
          '$dayOfYear': '$datetime'
        },
        'datetime': 1
      }
    }
  ]);
};

module.exports = mongoose.model('PiDataPoint', schema);
