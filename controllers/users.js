const { DocumentNotFoundError, CastError, ValidationError } = require('mongoose').Error;
const User = require('../models/user');

const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

const getUsers = async (_, res) => {
  try {
    const users = await User.find({});
    res.send({ data: users });
  } catch (err) {
    res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
};

const createUser = async (req, res) => {
  const { name, about, avatar } = req.body;

  try {
    const user = await User.create({ name, about, avatar });
    res.send({ data: user });
  } catch (err) {
    if (err instanceof ValidationError) {
      const errorMessage = Object.values(err.errors)
        .map((error) => error.message)
        .join(' ');
      res
        .status(HTTP_STATUS_BAD_REQUEST)
        .send({ message: `Переданы некорректные данные ${errorMessage}` });
    } else {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: err.message });
    }
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).orFail();
    res.send({ data: user });
  } catch (err) {
    if (err instanceof DocumentNotFoundError) {
      res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователя нет в базе' });
    } else if (err instanceof CastError) {
      res
        .status(HTTP_STATUS_BAD_REQUEST)
        .send({ message: 'Неверный формат идентификатора пользователя' });
    } else {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
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
        upsert: true, // если пользователь не найден, он будет создан
      },
    ).orFail();
    res.send({ data: user });
  } catch (err) {
    if (err instanceof ValidationError) {
      const errorMessage = Object.values(err.errors)
        .map((error) => error.message)
        .join(' ');
      res
        .status(HTTP_STATUS_BAD_REQUEST)
        .send({ message: `Переданы некорректные данные при обновлении профиля ${errorMessage}` });
    } else if (err instanceof DocumentNotFoundError) {
      res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь с указанным ID не найден' });
    } else if (err instanceof CastError) {
      res
        .status(HTTP_STATUS_BAD_REQUEST)
        .send({ message: 'Неверный формат идентификатора пользователя' });
    } else {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    }
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
        .join(' ');
      res
        .status(HTTP_STATUS_BAD_REQUEST)
        .send({ message: `Переданы некорректные данные при обновлении аватара ${errorMessage}` });
    } else if (err instanceof DocumentNotFoundError) {
      res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь с указанным ID не найден' });
    } else if (err instanceof CastError) {
      res
        .status(HTTP_STATUS_BAD_REQUEST)
        .send({ message: 'Неверный формат идентификатора пользователя' });
    } else {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    }
  }
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  updateAvatar,
};
