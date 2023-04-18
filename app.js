const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');

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

app.use(router)

app.listen(PORT, () => {
  console.log(`Сервер запущен ${PORT}`);
});
