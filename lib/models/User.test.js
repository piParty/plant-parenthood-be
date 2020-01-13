const User = require('./User');

describe('tests for the User model', () => {

  it('has a required email field', () => {
    const user = new User(); 
    const { errors } = user.validateSync();

    expect(errors.email.message).toEqual('Path `email` is required.');
  });

  it('has a required passwordHash field', () => {
    const user = new User(); 
    const { errors } = user.validateSync();

    expect(errors.passwordHash.message).toEqual('Path `passwordHash` is required.');
  });

  it('has a required location field', () => {
    const user = new User(); 
    const { errors } = user.validateSync();

    expect(errors.location.message).toEqual('Path `location` is required.');
  });

  it('has a required raspberryPi field', () => {
    const user = new User(); 
    const { errors } = user.validateSync();

    expect(errors.raspberryPi.message).toEqual('Path `raspberryPi` is required.');
  });

}); 
