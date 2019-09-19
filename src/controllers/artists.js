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


exports.list = (req, res) => {
  Artist.find({}, (err, artists) => {
    res.status(200).json(artists);
  });
};

exports.find = (req, res) => {
  Artist.findOne()
    .where('_id').equals(req.params.id)
    .exec((err, artist) => {
      if (!artist) {
        res.status(404).json({ error: 'The artist could not be found.' });
      } else {
        res.status(200).json(artist);
      }
    });
};
