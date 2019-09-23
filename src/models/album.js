const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  artist: { type: mongoose.Schema.ObjectId, ref: 'Artist' },
  name: String,
  year: Number,
});

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;
