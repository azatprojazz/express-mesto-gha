const { DocumentNotFoundError, CastError, ValidationError } = require('mongoose').Error;
const Card = require('../models/card');

const {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    res.send({ data: cards });
  } catch (err) {
    res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
};

const createCard = async (req, res) => {
  const { name, link } = req.body;

  try {
    const card = await Card.create({ name, link, owner: req.user._id });
    const populatedCard = await card.populate(['owner']);
    res.status(HTTP_STATUS_CREATED).send({ data: populatedCard });
  } catch (err) {
    console.log(err);
    if (err instanceof ValidationError) {
      const errorMessage = Object.values(err.errors)
        .map((error) => error.message)
        .join(' ');
      res.status(HTTP_STATUS_BAD_REQUEST).send({ message: `Переданы некорректные данные ${errorMessage}` });
    } else {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: err.message });
    }
  }
};

const deleteCardById = async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId).populate(['owner', 'likes']);

    if (!card) {
      res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с таким ID не найдена' });
    } else {
      res.send({ data: card });
    }
  } catch (err) {
    if (err instanceof CastError) {
      res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Неверный формат идентификатора карточки' });
    } else {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    }
  }
};

const likeCard = async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    ).populate(['owner', 'likes']);
    if (!updatedCard) {
      res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с таким ID не найдена' });
    } else {
      res.status(200).json(updatedCard);
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      const errorMessage = Object.values(err.errors)
        .map((error) => error.message)
        .join(' ');
      res
        .status(HTTP_STATUS_BAD_REQUEST)
        .send({ message: `Переданы некорректные данные для постановки/снятии лайка ${errorMessage}` });
    } else if (error instanceof CastError) {
      res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Неверный формат идентификатора карточки или пользователя' });
    } else {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Произошла ошибка' });
    }
  }
};

const dislikeCard = async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    ).populate(['owner', 'likes']);
    if (!updatedCard) {
      res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с таким ID не найдена' });
    } else {
      res.status(200).json(updatedCard);
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      const errorMessage = Object.values(err.errors)
        .map((error) => error.message)
        .join(' ');
      res
        .status(HTTP_STATUS_BAD_REQUEST)
        .send({ message: `Переданы некорректные данные для постановки/снятии лайка ${errorMessage}` });
    } else if (error instanceof CastError) {
      res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Неверный формат идентификатора карточки или пользователя' });
    } else {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Произошла ошибка' });
    }
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
