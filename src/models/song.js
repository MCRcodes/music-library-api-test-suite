const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  name: String,
  artist: { type: mongoose.Schema.ObjectId, ref: 'Artist' },
  album: { type: mongoose.Schema.ObjectId, ref: 'Album' },
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
