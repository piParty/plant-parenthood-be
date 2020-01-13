const Data = require('./PiData');

describe('tests for the Data model', () => {

  it('has a required raspberryPi field', () => {
    const data = new Data(); 
    const { errors } = data.validateSync();

    expect(errors.raspberryPi.message).toEqual('Path `raspberryPi` is required.');
  });

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

  it('has a required piLocationInHouse field', () => {
    const data = new Data(); 
    const { errors } = data.validateSync();

    expect(errors.piLocationInHouse.message).toEqual('Path `piLocationInHouse` is required.');
  });

  it('has a required city field', () => {
    const data = new Data(); 
    const { errors } = data.validateSync();

    expect(errors.city.message).toEqual('Path `city` is required.');
  });

}); 
