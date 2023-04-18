const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();

const url = 'mongodb://localhost:27017/mestodb';

mongoose.connect(url, {
  useNewUrlParser: true,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '643e799303557cb9cbf8a927', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen(PORT, () => {
  console.log(`Сервер запущен ${PORT}`);
});
