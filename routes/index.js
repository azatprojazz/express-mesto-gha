const router = require('express').Router();
const users = require('./users');
const cards = require('./cards');
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const { NOT_FOUND_404 } = require('../utils/constants');
const {
  createUserValidation,
  userLoginValidation,
} = require('../middlewares/validators/UserValidations');

// роуты, не требующие авторизации,
// например, регистрация и логин
router.post('/signup', createUserValidation, createUser);
router.post('/signin', userLoginValidation, login);

router.use('/users', auth, users);
router.use('/cards', auth, cards);

router.use((_, res) => {
  res.status(NOT_FOUND_404).send({ message: 'Запрашиваемый ресурс не найден' });
});

module.exports = router;
