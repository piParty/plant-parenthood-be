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
      'humidity': 1
    }
  }, {
    '$limit': 10
  }
];
