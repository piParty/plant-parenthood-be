const PiDataSession = require('./PiDataSession');

describe('tests for the PiDataSession model', () => {

  it('has a required piNickname field', () => {
    const data = new PiDataSession(); 
    const { errors } = data.validateSync();

    expect(errors.piNickname.message).toEqual('Path `piNickname` is required.');
  });

  it('has a required sensorType field', () => {
    const data = new PiDataSession({ sensorType: [] }); 
    expect(data.sensorType).toEqual(expect.arrayContaining([]));
  });

  it('has a required sensorType field that only accepts the enum values', () => {
    const data = new PiDataSession({ sensorType: ['fire'] }); 
    const { errors } = data.validateSync();
    expect(errors['sensorType.0'].message).toEqual('`fire` is not a valid enum value for path `sensorType.0`.');
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
