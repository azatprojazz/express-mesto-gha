const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '64404d6a4e10670269c46adf', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use(router);

app.listen(PORT, () => {
  console.log(`Сервер слушает порт => ${PORT}`);
});
