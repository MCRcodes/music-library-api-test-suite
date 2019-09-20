const Artist = require('../models/artist');
const { find } = require('mongoose');

exports.create = (req, res) => {
  const artist = new Artist({
    name: req.body.name,
    genre: req.body.genre,
  });

  artist.save().then(() => {
    res.status(201).json(artist);
  });
};

exports.list = (req, res) => {
  Artist.find({}, (err, artists) => {
    res.status(200).send(artists);
  });
};

exports.find = (req, res) => {
  Artist.findById(req.params.artistId, (err, Aid) => {
    if (!Aid) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      res.status(200).json(Aid);
    }
  });
};
