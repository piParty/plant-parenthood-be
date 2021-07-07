const User = require('../models/User');

const checkForToken = function(req) {
  const token = req.cookies.session;
  if(!token){
    const err = new Error('Login required.');
    err.status = 403;
    throw err;
  }
  return token;
};

const ensureAuth = roles => (req, res, next) => {
  const token = checkForToken(req);
  User
    .findByAuthToken(token)
    .then(user => {
      if(!roles.includes(user.role)) {
        const err = new Error(`Invalid role ${user.role}. Requires ${roles}.`);
        err.status = 403;
        throw err;
      }
      req.user = user;
      next();
    })
    .catch(next);
};

const ensureUserAuth = ensureAuth(['user', 'admin']);

const ensureAdminAuth = ensureAuth(['admin']);

module.exports = {
  ensureUserAuth,
  ensureAdminAuth,
};
