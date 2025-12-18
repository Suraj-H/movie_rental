const { Customer, validate: validateCustomer } = require('../models/customer');
const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/:id', validateObjectId, async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer)
    return res
      .status(404)
      .send('The customer with the given ID was not found.');

  res.send(customer);
});

router.get('/', async (req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});

router.post('/', [auth, validate(validateCustomer)], async (req, res) => {
  let customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });
  customer = await customer.save();

  res.send(customer);
});

router.put(
  '/:id',
  [auth, validateObjectId, validate(validateCustomer)],
  async (req, res) => {
    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id },
      {
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone,
      },
      { new: true, runValidators: true },
    );

    if (!customer)
      return res
        .status(404)
        .send('The customer with the given ID was not found.');

    res.send(customer);
  },
);

router.delete('/:id', [auth, validateObjectId], async (req, res) => {
  const customer = await Customer.findOneAndDelete({ _id: req.params.id });

  if (!customer)
    return res
      .status(404)
      .send('The customer with the given ID was not found.');

  res.send(customer);
});

module.exports = router;
