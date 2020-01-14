const PiDataPoint = require('./PiDataPoint');
const mongoose = require('mongoose');

describe('tests for the PiDataSession model', () => {
  
  it('has a required datafield', () => {
    const data = new PiDataPoint();
    const { errors } = data.validateSync();
    expect(errors.data.message).toEqual('Path `data` is required.');
  });
  it('has a required piTimestamp field', () => {
    const data = new PiDataPoint(); 
    const { errors } = data.validateSync();
  
    expect(errors.piTimestamp.message).toEqual('Path `piTimestamp` is required.');
  });

  it('should be able to make a new PiDataPoint', () => {
    const sessionID = new mongoose.Types.ObjectId();
    const timeStamp = new Date('1/13/20');
    const data = new PiDataPoint({
      piDataSessionId: sessionID,
      data: {
        light: 300,
        temperature: 18,
      },
      piTimestamp: timeStamp
    });
    console.log(data);
    expect(data.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      piDataSessionId: expect.any(mongoose.Types.ObjectId),
      data: {
        light: 300,
        temperature: 18
      },
      piTimestamp: timeStamp
    });
  });
  
}); 
