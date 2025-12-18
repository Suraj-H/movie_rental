const winston = require('winston');
const {
  HTTP_STATUS,
  ERROR_TYPES,
  ERROR_MESSAGES,
} = require('../utils/constants');

module.exports = function (err, req, res, next) {
  winston.error(err.message, err);

  // Mongoose validation error
  if (err.name === ERROR_TYPES.VALIDATION_ERROR) {
    return res.status(HTTP_STATUS.BAD_REQUEST).send(err.message);
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === ERROR_TYPES.CAST_ERROR) {
    return res
      .status(HTTP_STATUS.NOT_FOUND)
      .send(ERROR_MESSAGES.INVALID_ID_FORMAT);
  }

  // JWT token invalid error
  if (err.name === ERROR_TYPES.JSON_WEB_TOKEN_ERROR) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .send(ERROR_MESSAGES.INVALID_TOKEN);
  }

  // JWT token expired error
  if (err.name === ERROR_TYPES.TOKEN_EXPIRED_ERROR) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .send(ERROR_MESSAGES.TOKEN_EXPIRED);
  }

  // Default
  res
    .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    .send(ERROR_MESSAGES.SOMETHING_FAILED);
};
