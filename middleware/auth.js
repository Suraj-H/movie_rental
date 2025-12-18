const jwt = require('jsonwebtoken');
const config = require('config');
const {
  HTTP_STATUS,
  HEADERS,
  ERROR_TYPES,
  ERROR_MESSAGES,
  CONFIG_KEYS,
} = require('../utils/constants');

module.exports = function (req, res, next) {
  const token = req.header(HEADERS.AUTH_TOKEN);
  if (!token)
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .send(ERROR_MESSAGES.NO_TOKEN_PROVIDED);

  try {
    const decoded = jwt.verify(token, config.get(CONFIG_KEYS.JWT_PRIVATE_KEY));
    req.user = decoded;
    next();
  } catch (ex) {
    // JWT token expired error
    if (ex.name === ERROR_TYPES.TOKEN_EXPIRED_ERROR) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .send(ERROR_MESSAGES.TOKEN_EXPIRED);
    }
    // JWT token invalid error
    if (ex.name === ERROR_TYPES.JSON_WEB_TOKEN_ERROR) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .send(ERROR_MESSAGES.INVALID_TOKEN);
    }
    // Default
    res.status(HTTP_STATUS.UNAUTHORIZED).send(ERROR_MESSAGES.INVALID_TOKEN);
  }
};
