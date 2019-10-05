const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  artist: { type: mongoose.Schema.ObjectId, ref: 'Artist' },
  album: { type: mongoose.Schema.ObjectId, ref: 'Album' },
  name: String,
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
