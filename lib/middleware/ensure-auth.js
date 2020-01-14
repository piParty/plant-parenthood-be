const User = require('../models/User');

const ensureUserAuth = (req, res, next) => {
  const token = req.cookies.session;

  User
    .findByToken(token)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(next);
};

const ensureAdminAuth = (req, res, next) => {
  const token = req.cookies.session;

  User
    .findByToken(token)
    .then(user => {
      if(!user.role === 'admin') {
        throw 'Not an admin';
      }
      req.user = user;
      next();
    })
    .catch(next);
};

module.exports = { 
  ensureUserAuth, 
  ensureAdminAuth,
};
