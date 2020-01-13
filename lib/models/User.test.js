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

  it('has a required role field', () => {
    const user = new User(); 
    const { errors } = user.validateSync();

    expect(errors.role.message).toEqual('Path `role` is required.');
  });

}); 
