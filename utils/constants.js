// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// HTTP Headers
const HEADERS = {
  AUTH_TOKEN: 'x-auth-token',
  CONTENT_TYPE: 'Content-Type',
};

// Error Type Names
const ERROR_TYPES = {
  VALIDATION_ERROR: 'ValidationError',
  CAST_ERROR: 'CastError',
  JSON_WEB_TOKEN_ERROR: 'JsonWebTokenError',
  TOKEN_EXPIRED_ERROR: 'TokenExpiredError',
};

// Error Messages
const ERROR_MESSAGES = {
  // Authentication & Authorization
  NO_TOKEN_PROVIDED: 'Access denied. No token provided.',
  TOKEN_EXPIRED: 'Token expired.',
  INVALID_TOKEN: 'Invalid token.',
  NOT_ADMIN: 'Access denied. User is not an admin.',
  INVALID_EMAIL_OR_PASSWORD: 'Invalid email or password.',
  USER_ALREADY_REGISTERED: 'User already registered.',

  // Validation Errors
  INVALID_ID: 'Invalid ID.',
  INVALID_ID_FORMAT: 'Invalid ID format.',

  // Resource Not Found
  RESOURCE_NOT_FOUND: (resource) =>
    `The ${resource} with the given ID was not found.`,
  RENTAL_NOT_FOUND: 'Rental not found.',

  // Business Logic Errors
  INVALID_CUSTOMER: 'Invalid customer.',
  INVALID_MOVIE: 'Invalid movie.',
  INVALID_GENRE: 'Invalid genre.',
  MOVIE_NOT_IN_STOCK: 'Movie not in stock.',
  RETURN_ALREADY_PROCESSED: 'Return already processed.',

  // Server Errors
  SOMETHING_FAILED: 'Something failed.',
};

// Resource Names
const RESOURCES = {
  CUSTOMER: 'customer',
  MOVIE: 'movie',
  GENRE: 'genre',
  RENTAL: 'rental',
  USER: 'user',
};

// API Route Paths
const ROUTES = {
  GENRES: '/api/genres',
  CUSTOMERS: '/api/customers',
  MOVIES: '/api/movies',
  RENTALS: '/api/rentals',
  USERS: '/api/users',
  AUTH: '/api/auth',
  RETURNS: '/api/returns',
};

// Log Messages
const LOG_MESSAGES = {
  RENTAL_CREATION_FAILED: 'Rental creation failed:',
  RETURN_PROCESSING_FAILED: 'Return processing failed:',
  CONNECTED_TO_DB: (db) => `Connected to ${db}...`,
  LISTENING_ON_PORT: (port) => `Listening on port ${port}...`,
  FATAL_ERROR_JWT_KEY: 'FATAL ERROR: jwtPrivateKey is not defined.',
  JWT_KEY_INSTRUCTIONS:
    'Set the jwtPrivateKey environment variable or add it to your .env file.',
};

// File Names
const LOG_FILES = {
  LOGFILE: 'logfile.log',
  UNCAUGHT_EXCEPTIONS: 'uncaughtExceptions.log',
};

// Configuration Keys
const CONFIG_KEYS = {
  JWT_PRIVATE_KEY: 'jwtPrivateKey',
  DB: 'db',
  PORT: 'port',
};

module.exports = {
  HTTP_STATUS,
  HEADERS,
  ERROR_TYPES,
  ERROR_MESSAGES,
  RESOURCES,
  ROUTES,
  LOG_MESSAGES,
  LOG_FILES,
  CONFIG_KEYS,
};
