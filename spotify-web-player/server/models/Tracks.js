const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TrackSchema = new Schema({
  name: { type: String, required: true },
  album: { type: Schema.Types.ObjectId, ref: 'Album' },
  spotifyUri: { type: String, required: true },
  durationMs: { type: Number },
  artists: [{ name: String }],
  previewUrl: { type: String }, // Spotify preview URL
});

module.exports = mongoose.model('Track', TrackSchema);
