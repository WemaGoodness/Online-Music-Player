const express = require('express');
const {
    generate_spotify_auth_url,
    handle_spotify_callback,
    create_spotify_playlist,
    get_user_playlists,
    search_spotify,
    play_track,
    pause_playback,
    resume_playback,
    seek_playback,
} = require('../controllers/spotifycontroller');

const router = express.Router();

// Spotify authentication routes
router.get('/login', generate_spotify_auth_url);
router.get('/callback', handle_spotify_callback);

// Spotify playlist routes
router.post('/create-playlist', create_spotify_playlist);
router.get('/playlists', get_user_playlists);

// Spotify search route
router.get('/search', search_spotify);

// Spotify playback control routes
router.post('/play', play_track);
router.post('/pause', pause_playback);
router.post('/resume', resume_playback);
router.post('/seek', seek_playback);

module.exports = router;
