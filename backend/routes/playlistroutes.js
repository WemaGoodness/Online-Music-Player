const express = require('express');
const {
    create_playlist,
    get_user_playlists,
    add_track_to_playlist,
    remove_track_from_playlist,
    delete_playlist,
} = require('../controllers/playlistcontroller');
const protect = require('../middleware/authmiddleware');  // JWT authentication middleware

const router = express.Router();

// Route to create a new playlist (protected)
router.post('/', protect, create_playlist);

// Route to get all playlists for the logged-in user (protected)
router.get('/', protect, get_user_playlists);

// Route to add a track to a playlist (protected)
router.post('/:playlist_id/tracks', protect, add_track_to_playlist);

// Route to remove a track from a playlist (protected)
router.delete('/:playlist_id/tracks/:track_id', protect, remove_track_from_playlist);

// Route to delete a playlist (protected)
router.delete('/:playlist_id', protect, delete_playlist);

module.exports = router;
