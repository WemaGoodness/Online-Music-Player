const { client_id, redirect_uri } = require('../config/spotifyConfig');
const generateRandomString = require('../utils/generateRandomString');

// Login route handler to initiate Spotify authorization process
module.exports = (req, res) => {
    const scope = 'user-read-private user-read-email user-library-modify user-library-read user-follow-read user-follow-modify user-read-recently-played user-read-playback-position playlist-modify-public playlist-modify-private streaming user-read-playback-state user-modify-playback-state';
    const state = generateRandomString(16); // Generate random string for CSRF protection

    // Set up URL parameters for Spotify authorization
    const authQueryParams = new URLSearchParams({
        response_type: 'code', // Response type to get authorization code
        client_id,
        scope,
        redirect_uri,
        state,
    });

    // Redirect to Spotify's authorization URL
    res.redirect(`https://accounts.spotify.com/authorize?${authQueryParams.toString()}`);
};
