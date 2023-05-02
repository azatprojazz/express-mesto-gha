const router = require('express').Router();
const {
  getUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);

router.get('/:id', getUserById);

router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
