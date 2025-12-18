const { HTTP_STATUS, ERROR_MESSAGES } = require('../utils/constants');

module.exports = function (req, res, next) {
  // 401 Unauthorized
  if (!req.user) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .send(ERROR_MESSAGES.NO_TOKEN_PROVIDED);
  }

  // 403 Forbidden
  if (!req.user.isAdmin) {
    return res.status(HTTP_STATUS.FORBIDDEN).send(ERROR_MESSAGES.NOT_ADMIN);
  }

  next();
};
