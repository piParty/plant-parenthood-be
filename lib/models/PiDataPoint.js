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
      //first we need to get all the values extracted from the nested arrays so we can match against them. We also get the hour of the day for each measurement.
      '$project': {
        'lightAverage': '$data.light.averageValue',
        'lightStandardDeviation': '$data.light.standardDeviation',
        'humidityAverage': '$data.humidity.averageValue',
        'humidityStandardDeviation': '$data.humidity.standardDeviation',
        'temperatureAverage': '$data.temperature.averageValue',
        'temperatureStandardDeviation': '$data.humidity.standardDeviation',
        'piDataSessionId': sessionId,
        'piTimestamp': '$piTimestamp',
        'hour': {
          '$hour': '$piTimestamp'
        }
      }
    }, {
      //sanity checks for the standard deviations to filter out bad data.
      '$match': {
        '$and': [
          {
            'humidityStandardDeviation': {
              '$gt': 0,
              '$lt': 50
            }
          }, {
            'lightStandardDeviation': {
              '$gt': 0,
              '$lt': 1000
            }
          }, {
            'temperatureStandardDeviation': {
              '$gt': 0,
              '$lt': 10
            }
          }

        ]
      }
    }, {
      //next, we group by the hour of the day, and calculate averages and standard deviations over the course of each hour.
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
      //next we sort by id which is equal to the hour of the day to arrange chronologically
      '$sort': {
        '_id': 1
      }
    }, {
      //Finally for readability of output, we set the id field to a field named "hour"...
      '$addFields': {
        'hour': '$_id'
      }
    }, {
      //then we hide the id field as it's redundant.
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
    },
    {
      '$addFields': {
        'datetime': {
          '$dateFromString': {
            'dateString': '$piTimeStamp'
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
      '$project': {
        '_id': 0
      }
    }
  ]);
};

module.exports = mongoose.model('PiDataPoint', schema);
