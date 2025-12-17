const config = require('config');

module.exports = function () {
  const jwtPrivateKey = config.get('jwtPrivateKey');
  if (!jwtPrivateKey || jwtPrivateKey.trim() === '') {
    throw new Error(
      'FATAL ERROR: jwtPrivateKey is not defined.\n' +
        'Set the jwtPrivateKey environment variable or add it to your .env file.',
    );
  }
};
