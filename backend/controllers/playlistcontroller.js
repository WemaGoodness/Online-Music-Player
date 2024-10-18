const playlist = require('../models/playlistmodel');

// Create a new playlist for a user
const create_playlist = async (req, res) => {
    const { name, description } = req.body;

    try {
        // Create a new playlist and associate it with the logged-in user
        const new_playlist = new playlist({
            name,
            description,
            user: req.user._id,  // 'user' comes from JWT authentication middleware
        });

        // Save the new playlist to the database
        await new_playlist.save();

        // Return the created playlist
        res.status(201).json(new_playlist);
    } catch (error) {
        // Handle any errors and return 500 status
        res.status(500).json({ message: 'Error creating playlist', error });
    }
};

// Get all playlists for the logged-in user
const get_user_playlists = async (req, res) => {
    try {
        // Find playlists that belong to the logged-in user
        const playlists = await playlist.find({ user: req.user._id });

        // Return the user's playlists
        res.status(200).json(playlists);
    } catch (error) {
        // Handle errors in fetching playlists
        res.status(500).json({ message: 'Error fetching playlists', error });
    }
};

// Add a track to a playlist
const add_track_to_playlist = async (req, res) => {
    const { playlist_id } = req.params;
    const { name, artist, track_id } = req.body;  // Track details

    try {
        // Find the playlist by ID and ensure it belongs to the logged-in user
        const playlist = await playlist.findOne({ _id: playlist_id, user: req.user._id });

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found or not authorized' });
        }

        // Add the track to the playlist's 'tracks' array
        playlist.tracks.push({ name, artist, track_id });

        // Save the updated playlist
        await playlist.save();

        // Return the updated playlist
        res.status(200).json(playlist);
    } catch (error) {
        // Handle errors in adding the track
        res.status(500).json({ message: 'Error adding track to playlist', error });
    }
};

// Remove a track from a playlist
const remove_track_from_playlist = async (req, res) => {
    const { playlist_id, track_id } = req.params;

    try {
        // Find the playlist by ID and ensure it belongs to the logged-in user
        const playlist = await playlist.findOne({ _id: playlist_id, user: req.user._id });

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found or not authorized' });
        }

        // Filter out the track to remove it from the playlist
        playlist.tracks = playlist.tracks.filter(track => track.track_id !== track_id);

        // Save the updated playlist
        await playlist.save();

        // Return the updated playlist
        res.status(200).json(playlist);
    } catch (error) {
        // Handle errors in removing the track
        res.status(500).json({ message: 'Error removing track from playlist', error });
    }
};

// Delete a playlist
const delete_playlist = async (req, res) => {
    const { playlist_id } = req.params;

    try {
        // Find and delete the playlist, ensuring it belongs to the logged-in user
        const playlist = await playlist.findOneAndDelete({ _id: playlist_id, user: req.user._id });

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found or not authorized' });
        }

        // Return a success message
        res.status(200).json({ message: 'Playlist deleted successfully' });
    } catch (error) {
        // Handle errors in deleting the playlist
        res.status(500).json({ message: 'Error deleting playlist', error });
    }
};

// Export controller functions
module.exports = {
    create_playlist,
    get_user_playlists,
    add_track_to_playlist,
    remove_track_from_playlist,
    delete_playlist,
};
