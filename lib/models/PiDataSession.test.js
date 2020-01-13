const PiDataSession = require('./PiDataSession');

describe('tests for the PiDataSession model', () => {

  it('has a required piNickname field', () => {
    const data = new PiDataSession(); 
    const { errors } = data.validateSync();

    expect(errors.piNickname.message).toEqual('Path `piNickname` is required.');
  });

  it('has a required sensorType field', () => {
    const data = new PiDataSession(); 
    const { errors } = data.validateSync();

    expect(errors.sensorType.message).toEqual('Path `sensorType` is required.');
  });

  it('has a required piLocationInHouse field', () => {
    const data = new PiDataSession(); 
    const { errors } = data.validateSync();

    expect(errors.piLocationInHouse.message).toEqual('Path `piLocationInHouse` is required.');
  });

  it('has a required city field', () => {
    const data = new PiDataSession(); 
    const { errors } = data.validateSync();

    expect(errors.city.message).toEqual('Path `city` is required.');
  });

}); 
