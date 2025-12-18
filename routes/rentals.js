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

router.get('/:id', validateObjectId, async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental)
    return res.status(404).send('The rental with the given ID was not found.');

  res.send(rental);
});

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.post('/', [auth, validate(validateRental)], async (req, res) => {
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer.');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie.');

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const movieInTransaction = await Movie.findOne({
      _id: movie._id,
      numberInStock: { $gt: 0 },
    }).session(session);

    if (!movieInTransaction) {
      await session.abortTransaction();
      return res.status(400).send('Movie not in stock.');
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
    winston.error('Rental creation failed:', ex);
    res.status(500).send('Something failed.');
  } finally {
    session.endSession();
  }
});

module.exports = router;
