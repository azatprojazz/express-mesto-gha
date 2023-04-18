const Card = require('../models/card');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    res.send({ data: cards });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const createCard = async (req, res) => {
  const { name, link } = req.body;

  try {
    const card = await Card.create({ name, link, owner: req.user._id });
    const populatedCard = await card.populate(['owner']);
    res.send({ data: populatedCard });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const deleteCardById = async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId).populate(['owner', 'likes']);
    res.send({ data: card });
  } catch (err) {
    res.status(500).send({ message: 'Произошла ошибка' });
  }
};

const likeCard = async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    ).populate(['owner', 'likes']);

    res.status(200).json(updatedCard);
  } catch (error) {
    res.status(500).json({ message: 'Произошла ошибка' });
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

    res.status(200).json(updatedCard);
  } catch (error) {
    res.status(500).json({ message: 'Произошла ошибка' });
  }
};


module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
