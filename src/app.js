const express = require('express');

const app = express();

app.get('*', (req, res) => {
  res.status(200).json({ message: 'Hello World!' });
});


app.post('/artists', (req, res) => {
  res.status(201).send();
});

module.exports = app;
