const router = require('express').Router();
const { getUsers, createUser, getUserById, updateUser, updateAvatar } = require('../controllers/users');

router.get('/', getUsers);
router.post('/', createUser);

router.get('/:id', getUserById);

router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar)

module.exports = router;
