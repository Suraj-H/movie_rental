const mongoose = require('mongoose');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../utils/constants');

module.exports = function (req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(HTTP_STATUS.NOT_FOUND).send(ERROR_MESSAGES.INVALID_ID);

  next();
};
