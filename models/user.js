const mongoose = require('mongoose');

const { isEmail } = require('validator');

const bcrypt = require('bcryptjs'); // импортируем bcrypt

const UnauthorizedError = require('../errors/Unauthorized');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'не введен email'],
      unique: true,
      validate: {
        validator: (email) => isEmail(email),
        message: 'Адрес email не соответствует формату',
      },
    },
    password: {
      type: String,
      required: [true, 'не введен пароль'],
      minlength: [6, 'минимальная длина пароля от 6 символов'], // под вопросом
      select: false, // необходимо добавить поле select
    },
    name: {
      type: String,
      minlength: [2, 'недостаточная длина имени'],
      maxlength: [30, 'длина имени превышает 30 символов'],
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: [2, 'недостаточная длина описания'],
      maxlength: [30, 'длина описания превышает 30 символов'],
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
  },
  { toJSON: { useProjection: true }, toObject: { useProjection: true }, versionKey: false },
);

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }

          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
