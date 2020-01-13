const PiDataPoint = require('./PiDataPoint');

describe('tests for the PiDataSession model', () => {
  
  it('has a required averageValue field', () => {
    const data = new PiDataPoint(); 
    const { errors } = data.validateSync();
  
    expect(errors.averageValue.message).toEqual('Path `averageValue` is required.');
  });

  it('has a required standardDeviation field', () => {
    const data = new PiDataPoint(); 
    const { errors } = data.validateSync();
  
    expect(errors.standardDeviation.message).toEqual('Path `standardDeviation` is required.');
  });
  
}); 
