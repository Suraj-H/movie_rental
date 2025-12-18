const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Genre, validate: validateGenre } = require('../models/genre');
const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const {
  HTTP_STATUS,
  ERROR_MESSAGES,
  RESOURCES,
} = require('../utils/constants');

router.get('/:id', validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre)
    return res
      .status(HTTP_STATUS.NOT_FOUND)
      .send(ERROR_MESSAGES.RESOURCE_NOT_FOUND(RESOURCES.GENRE));

  res.send(genre);
});

router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

router.post('/', [auth, validate(validateGenre)], async (req, res) => {
  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();

  res.send(genre);
});

router.put(
  '/:id',
  [auth, validateObjectId, validate(validateGenre)],
  async (req, res) => {
    const genre = await Genre.findOneAndUpdate(
      { _id: req.params.id },
      { name: req.body.name },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!genre)
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .send(ERROR_MESSAGES.RESOURCE_NOT_FOUND(RESOURCES.GENRE));

    res.send(genre);
  },
);

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const genre = await Genre.findOneAndDelete({ _id: req.params.id });

  if (!genre)
    return res
      .status(HTTP_STATUS.NOT_FOUND)
      .send(ERROR_MESSAGES.RESOURCE_NOT_FOUND(RESOURCES.GENRE));

  res.send(genre);
});

module.exports = router;
