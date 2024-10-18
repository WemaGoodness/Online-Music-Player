const mongoose = require('mongoose');

// Define the schema for a playlist
const playlist_schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,  // Playlist name is required
    },
    description: {
        type: String,
        default: '',  // Optional description for the playlist
    },
    tracks: [
        {
            name: String,    // Track name
            artist: String,  // Track artist
            track_id: String, // Spotify track ID
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',   // Reference to the user who owns this playlist
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,  // Automatically set creation date
    },
});

// Export the playlist model
const playlist = mongoose.model('playlist', playlist_schema);
module.exports = playlist;
