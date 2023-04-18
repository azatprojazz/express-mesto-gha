const express = require('express');
const { MongoClient } = require('mongodb');

const { PORT = 3000 } = process.env;

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Сервер запущен ${PORT}`);
});

const url = 'mongodb://localhost:27017/mestodb';

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error('Ошибка при подключении к MongoDB:', err);
    return;
  }
  console.log('Подключено к MongoDB');
});
