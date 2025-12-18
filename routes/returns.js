const Joi = require('joi');
const validate = require('../middleware/validate');
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const winston = require('winston');
const express = require('express');
const router = express.Router();

router.post('/', [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send('Rental not found.');

  if (rental.dateReturned)
    return res.status(400).send('Return already processed.');

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
    winston.error('Return processing failed:', ex);
    res.status(500).send('Something failed.');
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
