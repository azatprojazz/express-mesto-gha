const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'нет имени'],
      minlength: [2, 'недостаточная длина имени'],
      maxlength: [30, 'длина имени превышает 30 символов'],
    },
    about: {
      type: String,
      required: [true, 'нет описания'],
      minlength: [2, 'недостаточная длина описания'],
      maxlength: [30, 'длина описания превышает 30 символов'],
    },
    avatar: {
      type: String,
      required: [true, 'нет ссылки на картинку'],
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);
