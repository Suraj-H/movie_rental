const { HTTP_STATUS } = require('../utils/constants');

module.exports = (validator) => {
  return (req, res, next) => {
    const { error } = validator(req.body);
    if (error)
      return res.status(HTTP_STATUS.BAD_REQUEST).send(error.details[0].message);
    next();
  };
};
