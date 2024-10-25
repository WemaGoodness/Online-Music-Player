const request = require('request');
const { client_id, client_secret, redirect_uri } = require('../config/spotifyConfig');
let access_token = ''; // Variable to store access token

// Callback route to handle Spotify's authorization response and get access token
module.exports = (req, res) => {
    const code = req.query.code; // Authorization code received from Spotify

    // Options for token exchange request
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code,
            redirect_uri,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        json: true,
    };

    // Request to exchange code for access token
    request.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            access_token = body.access_token; // Store the access token
            res.redirect('/'); // Redirect to main app
        } else {
            res.status(response.statusCode).send('Failed to authenticate with Spotify');
        }
    });
};

// Route handler to return the access token when requested
module.exports.getToken = (req, res) => res.json({ access_token });
