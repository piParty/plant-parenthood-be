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
      }
    }
  }, {
    '$limit': 100
  }, {
    '$bucket': {
      'groupBy': '$hour',
      'boundaries': [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24
      ],
      'default': 'Other',
      'output': {
        'data': {
          '$push': {
            'light': '$light'
          }
        }
      }
    }
  }
];
