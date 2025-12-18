const Joi = require('joi');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../utils/constants');

router.post('/', validate(validateAuth), async (req, res) => {
  let user = await User.findOne({ email: req.body.email }).select('+password');
  if (!user)
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .send(ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD);

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .send(ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD);

  const token = user.generateAuthToken();
  res.send(token);
});

function validateAuth(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(req);
}

module.exports = router;
