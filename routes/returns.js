const Joi = require('joi');
const validate = require('../middleware/validate');
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const winston = require('winston');
const express = require('express');
const router = express.Router();
const {
  HTTP_STATUS,
  ERROR_MESSAGES,
  LOG_MESSAGES,
} = require('../utils/constants');

router.post('/', [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental)
    return res
      .status(HTTP_STATUS.NOT_FOUND)
      .send(ERROR_MESSAGES.RENTAL_NOT_FOUND);

  if (rental.dateReturned)
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .send(ERROR_MESSAGES.RETURN_ALREADY_PROCESSED);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    rental.return();
    await rental.save({ session });

    await Movie.updateOne(
      { _id: rental.movie._id },
      { $inc: { numberInStock: 1 } },
      { session },
    );

    await session.commitTransaction();
    res.send(rental);
  } catch (ex) {
    await session.abortTransaction();
    winston.error(LOG_MESSAGES.RETURN_PROCESSING_FAILED, ex);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(ERROR_MESSAGES.SOMETHING_FAILED);
  } finally {
    session.endSession();
  }
});

function validateReturn(req) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(req);
}

module.exports = router;
