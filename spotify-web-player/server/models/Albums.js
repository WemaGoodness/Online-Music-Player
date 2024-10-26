const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
  name: { type: String, required: true },
  spotifyId: { type: String, required: true },
  images: [{ url: String }],
  releaseDate: { type: String },
});

module.exports = mongoose.model('Album', AlbumSchema);
