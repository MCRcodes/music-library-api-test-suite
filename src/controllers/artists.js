const Artist = require('../models/artist');

exports.create = (req, res) => {
  const artist = new Artist({
    name: req.body.name,
    genre: req.body.genre,
  });
  artist.save().then(() => {
    res.status(201).json(artist);
  });
};
