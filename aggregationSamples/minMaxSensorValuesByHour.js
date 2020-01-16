[
  {
    '$addFields': {
      'ISODate': {
        '$dateFromString': {
          'dateString': '$datetime'
        }
      }
    }
  }, {
    '$group': {
      '_id': '$ISODate',
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
      'ISODate': 1,
      'light': 1,
      'temperature': 1,
      'humidity': 1,
      'hour': {
        '$hour': '$ISODate'
      },
      'dayOfYear': {
        '$dayOfYear': '$ISODate'
      }
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
  }, {}
];
