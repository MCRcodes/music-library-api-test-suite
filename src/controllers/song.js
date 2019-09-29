const Song = require('../models/song');

exports.create = (req, res) => {
  const song = new Song({
    name: req.body.name,
    artist: req.body.artistId,
    album: req.params.id,
  });
  if (song.album) {
    song.save().then(() => {
      Song.findOne()
        .where('name').equals(req.body.name)
        .populate({ path: 'artist' })
        .populate({ path: 'album' })
        .exec((err, songId) => {
          res.status(201).json(songId);
        });
    });
  } else {
    res.status(404).json({ error: 'The album could not be found' });
  }
};
