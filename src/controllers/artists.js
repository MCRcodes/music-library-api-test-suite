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

exports.single = (req, res) => {
  Artist.findById()
    .where('_id').equals(req.params.id)
    .exec((err, artists) => {
      res.status(200).json(artists);
    });
};
