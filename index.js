require('dotenv').config({ quiet: true });
const winston = require('winston');
const express = require('express');
const config = require('config');
const { CONFIG_KEYS, LOG_MESSAGES } = require('./utils/constants');

const app = express();

// Startup sequence: Order matters for proper initialization
// 1. Config validation first (fail fast if config is invalid)
require('./startup/config')();

// 2. Logging setup (needed for error logging)
require('./startup/logging')();

// 3. Validation setup (Joi extensions)
require('./startup/validation')();

// 4. Database connection (before routes)
require('./startup/db')();

// 5. Routes registration (after db connection)
require('./startup/routes')(app);

// 6. Production middleware (helmet, compression - last)
require('./startup/prod')(app);

const port = config.get(CONFIG_KEYS.PORT);
const server = app.listen(port, () =>
  winston.info(LOG_MESSAGES.LISTENING_ON_PORT(port)),
);

module.exports = server;
