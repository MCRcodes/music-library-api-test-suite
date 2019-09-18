const express = require('express');
const artistControllers = require('./controllers/artists.js');

const app = express();
app.use(express.json());

app.post('/artists', artistControllers.create);
app.get('/artists', artistControllers.list);

module.exports = app;
