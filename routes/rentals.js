const { Rental, validate: validateRental } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');
const winston = require('winston');
const {
  HTTP_STATUS,
  ERROR_MESSAGES,
  RESOURCES,
  LOG_MESSAGES,
} = require('../utils/constants');

router.get('/:id', validateObjectId, async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental)
    return res
      .status(HTTP_STATUS.NOT_FOUND)
      .send(ERROR_MESSAGES.RESOURCE_NOT_FOUND(RESOURCES.RENTAL));

  res.send(rental);
});

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.post('/', [auth, validate(validateRental)], async (req, res) => {
  const customer = await Customer.findById(req.body.customerId);
  if (!customer)
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .send(ERROR_MESSAGES.INVALID_CUSTOMER);

  const movie = await Movie.findById(req.body.movieId);
  if (!movie)
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .send(ERROR_MESSAGES.INVALID_MOVIE);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const movieInTransaction = await Movie.findOne({
      _id: movie._id,
      numberInStock: { $gt: 0 },
    }).session(session);

    if (!movieInTransaction) {
      await session.abortTransaction();
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(ERROR_MESSAGES.MOVIE_NOT_IN_STOCK);
    }

    let rental = new Rental({
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
    });

    await Rental.create([rental], { session });
    await Movie.updateOne(
      { _id: movie._id },
      { $inc: { numberInStock: -1 } },
      { session },
    );
    await session.commitTransaction();
    res.send(rental);
  } catch (ex) {
    await session.abortTransaction();
    winston.error(LOG_MESSAGES.RENTAL_CREATION_FAILED, ex);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(ERROR_MESSAGES.SOMETHING_FAILED);
  } finally {
    session.endSession();
  }
});

module.exports = router;
