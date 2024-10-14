// spotifyroutes.js

const express = require('express');
const { get_spotify_auth_url, spotify_callback, search_tracks } = require('../controllers/spotifycontroller');

const router = express.Router();

// route to initiate Spotify authentication
router.get('/login', get_spotify_auth_url);

// route to handle Spotify callback after authentication
router.get('/callback', spotify_callback);

// route to search for tracks on Spotify
router.get('/search', search_tracks);

module.exports = router;
