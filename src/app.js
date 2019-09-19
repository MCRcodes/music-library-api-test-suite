const express = require('express');
const artistsController = require('../src/controllers/artists');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello World!' });
});

app.post('/artists', artistsController.create);

app.get('/artists', artistsController.list);

app.get('/artists/:id', artistsController.single);

module.exports = app;
