const router = require('express').Router();

const users = require('../routes/users');
const cards = require('../routes/cards');

router.use('/users', users);
router.use('/cards', cards);

module.exports = router;
