const { DocumentNotFoundError, CastError, ValidationError } = require('mongoose').Error;
const User = require('../models/user');

const {
  CREATED_201,
  BAD_REQUEST_400,
  NOT_FOUND_404,
  INTERNAL_SERVER_ERROR_500,
} = require('../utils/constants');

const getUsers = async (_, res) => {
  try {
    const users = await User.find({});
    res.send({ data: users });
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR_500).send({ message: err.message });
  }
};

const createUser = async (req, res) => {
  const { name, about, avatar } = req.body;

  try {
    const user = await User.create({ name, about, avatar });
    res.status(CREATED_201).send({ data: user });
  } catch (err) {
    if (err instanceof ValidationError) {
      const errorMessage = Object.values(err.errors)
        .map((error) => error.message)
        .join(', ');
      res
        .status(BAD_REQUEST_400)
        .send({ message: `Переданы некорректные данные: ${errorMessage}` });
    } else {
      res.status(INTERNAL_SERVER_ERROR_500).send({ message: err.message });
    }
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).orFail();
    res.send({ data: user });
  } catch (err) {
    if (err instanceof DocumentNotFoundError) {
      res.status(NOT_FOUND_404).send({ message: 'Пользователя нет в базе' });
      return;
    }
    if (err instanceof CastError) {
      res.status(BAD_REQUEST_400).send({ message: 'Неверный формат идентификатора пользователя' });
    } else {
      res.status(INTERNAL_SERVER_ERROR_500).send({ message: 'Произошла ошибка' });
    }
  }
};

const updateUser = async (req, res) => {
  const { name, about } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      },
    ).orFail();
    res.send({ data: user });
  } catch (err) {
    if (err instanceof ValidationError) {
      const errorMessage = Object.values(err.errors)
        .map((error) => error.message)
        .join(', ');
      res
        .status(BAD_REQUEST_400)
        .send({ message: `Переданы некорректные данные при обновлении профиля: ${errorMessage}` });
      return;
    }
    if (err instanceof DocumentNotFoundError) {
      res.status(NOT_FOUND_404).send({ message: 'Пользователь с указанным ID не найден' });
      return;
    }
    res.status(INTERNAL_SERVER_ERROR_500).send({ message: 'Произошла ошибка' });
  }
};

const updateAvatar = async (req, res) => {
  const { avatar } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
        upsert: true,
      },
    ).orFail();
    res.send({ data: user });
  } catch (err) {
    if (err instanceof ValidationError) {
      const errorMessage = Object.values(err.errors)
        .map((error) => error.message)
        .join(', ');
      res
        .status(BAD_REQUEST_400)
        .send({ message: `Переданы некорректные данные при обновлении аватара: ${errorMessage}` });
      return;
    }
    if (err instanceof DocumentNotFoundError) {
      res.status(NOT_FOUND_404).send({ message: 'Пользователь с указанным ID не найден' });
      return;
    }
    res.status(INTERNAL_SERVER_ERROR_500).send({ message: 'Произошла ошибка' });
  }
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  updateAvatar,
};
