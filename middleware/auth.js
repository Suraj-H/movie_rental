const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded;
    next();
  } catch (ex) {
    // JWT token expired error
    if (ex.name === 'TokenExpiredError') {
      return res.status(401).send('Token expired.');
    }
    // JWT token invalid error
    if (ex.name === 'JsonWebTokenError') {
      return res.status(401).send('Invalid token.');
    }
    // Default
    res.status(401).send('Invalid token.');
  }
};
