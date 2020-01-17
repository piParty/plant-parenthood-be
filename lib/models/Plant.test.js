const Plant = require('./Plant');

describe('tests for the Plant model', () => {

  it('has a required commonName field', () => {
    const plant = new Plant(); 
    const { errors } = plant.validateSync();

    expect(errors.commonName.message).toEqual('Path `commonName` is required.');
  });

  it('has a required sunlightPreference field that takes only the strings low, medium, or high', () => {
    const plant = new Plant({ sunlightPreference: 'super' }); 
    const { errors } = plant.validateSync();

    expect(errors.sunlightPreference.message).toEqual('`super` is not a valid enum value for path `sunlightPreference`.');
  });

}); 
