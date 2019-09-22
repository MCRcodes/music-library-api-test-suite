const Album = require('../models/album');

exports.create = (req, res) => {
  const album = new Album({
    name: req.body.name,
    year: req.body.year,
    artist: req.params.id,
  });
  if (!album.artist) {
    res.status(404).json({ error: 'The artist could not be found.' });
  } else {
    album.save().then(() => {
      res.status(201).json(album);
    });
  }
};

exports.list = (req, res) => {
  Album.find({}, (err, albums) => {
    res.status(200).json(albums);
  });
};

exports.find = (req, res) => {
  Album.findOne()
    .where('_id').equals(req.params.id)
    .exec((err, album) => {
      if (!album) {
        res.status(404).json({ error: 'The album could not be found.' });
      } else {
        res.status(200).json(album);
      }
    });
};

exports.findByArtist = (req, res) => {
  Album.find()
    .where('artist').equals(req.params.id)
    .exec((err, albums) => {
      if (!albums) {
        res.status(404).json({ error: 'The artist could not be found.' });
      } else {
        res.status(200).json(albums);
      }
    });
};
