const Joi = require('joi');
const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema(
  {
    customer: {
      type: new mongoose.Schema({
        name: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 50,
          trim: true,
        },
        isGold: {
          type: Boolean,
          default: false,
        },
        phone: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 50,
          trim: true,
        },
      }),
      required: true,
    },
    movie: {
      type: new mongoose.Schema({
        title: {
          type: String,
          required: true,
          trim: true,
          minlength: 5,
          maxlength: 255,
        },
        dailyRentalRate: {
          type: Number,
          required: true,
          min: 0,
          max: 255,
        },
      }),
      required: true,
    },
    dateOut: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dateReturned: {
      type: Date,
    },
    rentalFee: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  { timestamps: true },
);

// Indexes for lookup queries
rentalSchema.index({ 'customer._id': 1, 'movie._id': 1 }); // For lookup static
rentalSchema.index({ dateOut: -1 }); // For sorting
rentalSchema.index({ dateReturned: 1 }); // For filtering returned rentals

rentalSchema.statics.lookup = function (customerId, movieId) {
  return this.findOne({
    'customer._id': customerId,
    'movie._id': movieId,
  });
};

rentalSchema.methods.return = function () {
  this.dateReturned = new Date();

  const rentalDays = Math.floor(
    (this.dateReturned - this.dateOut) / (1000 * 60 * 60 * 24),
  );
  this.rentalFee = rentalDays * this.movie.dailyRentalRate;
};

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(rental);
}

exports.Rental = Rental;
exports.validate = validateRental;
