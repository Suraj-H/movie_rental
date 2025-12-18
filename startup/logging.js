const winston = require('winston');
const { LOG_FILES } = require('../utils/constants');
// require('winston-mongodb');

module.exports = function () {
  winston.exceptions.handle(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.prettyPrint(),
      ),
    }),
    new winston.transports.File({ filename: LOG_FILES.UNCAUGHT_EXCEPTIONS }),
  );

  process.on('unhandledRejection', (ex) => {
    throw ex;
  });

  winston.add(new winston.transports.File({ filename: LOG_FILES.LOGFILE }));
  // winston.add(new winston.transports.MongoDB, {
  //   db: 'mongodb://localhost/movie-rental',
  //   level: 'info'
  // });
};
