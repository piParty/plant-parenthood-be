const Plant = require('./Plant');

describe('tests for the Plant model', () => {

  it('has a required commonName field', () => {
    const plant = new Plant(); 
    const { errors } = plant.validateSync();

    expect(errors.commonName.message).toEqual('Path `commonName` is required.');
  });

  it('has a required plantLocationInHouse field', () => {
    const plant = new Plant(); 
    const { errors } = plant.validateSync();

    expect(errors.plantLocationInHouse.message).toEqual('Path `plantLocationInHouse` is required.');
  });

  it('has a required waterPreference field', () => {
    const plant = new Plant(); 
    const { errors } = plant.validateSync();

    expect(errors.waterPreference.message).toEqual('Path `waterPreference` is required.');
  });

  it('has a required sunlightPreference field', () => {
    const plant = new Plant(); 
    const { errors } = plant.validateSync();

    expect(errors.sunlightPreference.message).toEqual('Path `sunlightPreference` is required.');
  });

}); 
