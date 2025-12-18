const winston = require('winston');

module.exports = function (err, req, res, next) {
  winston.error(err.message, err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).send(err.message);
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(404).send('Invalid ID format.');
  }

  // JWT token invalid error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).send('Invalid token.');
  }

  // JWT token expired error
  if (err.name === 'TokenExpiredError') {
    return res.status(401).send('Token expired.');
  }

  // Default
  res.status(500).send('Something failed.');
};
