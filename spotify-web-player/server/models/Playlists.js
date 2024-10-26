const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlaylistSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  userId: { type: String, required: true },
  tracks: [{ type: Schema.Types.ObjectId, ref: 'Track' }],
  spotifyId: { type: String }, // Optional if playlist is created on Spotify
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Playlist', PlaylistSchema);
