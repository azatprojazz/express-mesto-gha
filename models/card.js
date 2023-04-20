const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'нет имени'],
      minlength: [2, 'недостаточная длина имени'],
      maxlength: [30, 'длина имени превышает 30 символов'],
    },
    link: {
      type: String,
      required: [true, 'нет ссылки'],
    },
    owner: {
      type: ObjectId,
      ref: 'user',
      required: [true, 'напишите имя пользователя'],
    },
    likes: {
      type: [ObjectId],
      ref: 'user',
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('card', cardSchema);
