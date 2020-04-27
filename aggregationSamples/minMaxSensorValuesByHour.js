
const agg = [
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
];
