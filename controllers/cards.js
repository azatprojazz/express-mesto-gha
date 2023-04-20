const { CastError, ValidationError } = require('mongoose').Error;
const Card = require('../models/card');

const {
  CREATED_201,
  BAD_REQUEST_400,
  NOT_FOUND_404,
  INTERNAL_SERVER_ERROR_500,
} = require('../utils/constants');

const getCards = async (_, res) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    res.send({ data: cards });
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR_500).send({ message: err.message });
  }
};

const createCard = async (req, res) => {
  const { name, link } = req.body;

  try {
    const card = await Card.create({ name, link, owner: req.user._id });
    const populatedCard = await card.populate(['owner']);
    res.status(CREATED_201).send({ data: populatedCard });
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

const deleteCardById = async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId).populate(['owner', 'likes']);

    if (!card) {
      res.status(NOT_FOUND_404).send({ message: 'Карточка с таким ID не найдена' });
    } else {
      res.send({ data: card });
    }
  } catch (err) {
    if (err instanceof CastError) {
      res.status(BAD_REQUEST_400).send({ message: 'Неверный формат идентификатора карточки' });
    } else {
      res.status(INTERNAL_SERVER_ERROR_500).send({ message: 'Произошла ошибка' });
    }
  }
};

const likeCard = async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).populate(['owner', 'likes']);

    if (!updatedCard) {
      res.status(NOT_FOUND_404).send({ message: 'Карточка с таким ID не найдена' });
    } else {
      res.json(updatedCard);
    }
  } catch (err) {
    if (err instanceof CastError) {
      res
        .status(BAD_REQUEST_400)
        .send({ message: 'Неверный формат идентификатора карточки или пользователя' });
    } else {
      res.status(INTERNAL_SERVER_ERROR_500).json({ message: 'Произошла ошибка' });
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
      { new: true },
    ).populate(['owner', 'likes']);
    if (!updatedCard) {
      res.status(NOT_FOUND_404).send({ message: 'Карточка с таким ID не найдена' });
    } else {
      res.json(updatedCard);
    }
  } catch (err) {
    if (err instanceof CastError) {
      res
        .status(BAD_REQUEST_400)
        .send({ message: 'Неверный формат идентификатора карточки или пользователя' });
    } else {
      res.status(INTERNAL_SERVER_ERROR_500).json({ message: 'Произошла ошибка' });
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
