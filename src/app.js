const express = require('express');
const artistsController = require('../src/controllers/artists');
const albumController = require('./controllers/albums');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello World!' });
});

app.post('/artists', artistsController.create);

app.get('/artists', artistsController.list);

app.get('/artists/:id', artistsController.find)

app.patch('/artists/:id', artistsController.update);

app.delete('/artists/:id', artistsController.delete);

app.post('/artists/:id/albums', albumController.create);

module.exports = app;
