const router = require('express').Router();
const users = require('./users');
const cards = require('./cards');
const { NOT_FOUND_404 } = require('../utils/constants');

router.use('/users', users);
router.use('/cards', cards);

router.use((_, res) => {
  res.status(NOT_FOUND_404).send({ message: 'Запрашиваемый ресурс не найден' });
});

module.exports = router;
