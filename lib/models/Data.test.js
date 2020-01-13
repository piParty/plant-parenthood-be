const Data = require('./Data');

describe('tests for the Data model', () => {

  it('has a required sensorType field', () => {
    const data = new Data(); 
    const { errors } = data.validateSync();

    expect(errors.sensorType.message).toEqual('Path `sensorType` is required.');
  });

  it('has a required value field', () => {
    const data = new Data(); 
    const { errors } = data.validateSync();

    expect(errors.value.message).toEqual('Path `value` is required.');
  });

  it('has a required locationInHouse field', () => {
    const data = new Data(); 
    const { errors } = data.validateSync();

    expect(errors.locationInHouse.message).toEqual('Path `locationInHouse` is required.');
  });

}); 
