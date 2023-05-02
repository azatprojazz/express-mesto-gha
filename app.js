const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./routes/index');
const errorMiddleware = require('./middlewares/errorMiddleware');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(router);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Сервер слушает порт => ${PORT}`);
});
