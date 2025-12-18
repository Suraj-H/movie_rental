const express = require('express');
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth');
const returns = require('../routes/returns');
const error = require('../middleware/error');
const { ROUTES } = require('../utils/constants');

module.exports = function (app) {
  app.use(express.json());
  app.use(ROUTES.GENRES, genres);
  app.use(ROUTES.CUSTOMERS, customers);
  app.use(ROUTES.MOVIES, movies);
  app.use(ROUTES.RENTALS, rentals);
  app.use(ROUTES.USERS, users);
  app.use(ROUTES.AUTH, auth);
  app.use(ROUTES.RETURNS, returns);
  app.use(error);
};
