const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');
const { CONFIG_KEYS, LOG_MESSAGES } = require('../utils/constants');

module.exports = function () {
  const db = config.get(CONFIG_KEYS.DB);
  mongoose
    .connect(db)
    .then(() => winston.info(LOG_MESSAGES.CONNECTED_TO_DB(db)));
};
