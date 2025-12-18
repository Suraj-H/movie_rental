const config = require('config');
const { CONFIG_KEYS, LOG_MESSAGES } = require('../utils/constants');

module.exports = function () {
  const jwtPrivateKey = config.get(CONFIG_KEYS.JWT_PRIVATE_KEY);
  if (!jwtPrivateKey || jwtPrivateKey.trim() === '') {
    throw new Error(
      `${LOG_MESSAGES.FATAL_ERROR_JWT_KEY}\n${LOG_MESSAGES.JWT_KEY_INSTRUCTIONS}`,
    );
  }
};
