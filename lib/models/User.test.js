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

  it('has a required role field that only takes user or admin roles', () => {
    const user = new User({ role: 'non-user' }); 
    const { errors } = user.validateSync();

    expect(errors.role.message).toEqual('`non-user` is not a valid enum value for path `role`.');
  });

  it('had a required myPis field', () => {
    const user = new User();
    const { errors } = user.validateSync();

    expect(errors.myPis.message).toEqual('Pi registration required.');
  });


  it('had a required piNickname field', () => {
    const user = new User({ myPis: [{ description: 'a pi' }] });
    const { errors } = user.validateSync();

    expect(errors['myPis.0.piNickname'].message).toEqual('Path `piNickname` is required.');
  });

}); 

