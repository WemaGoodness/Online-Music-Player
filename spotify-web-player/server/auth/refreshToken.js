const request = require('request');
const { client_id, client_secret } = require('../config/spotifyConfig');

// Route handler to refresh the access token using a stored refresh token
module.exports = (req, res) => {
    const refresh_token = stored_refresh_token; // Assume refresh_token is stored securely

    // Options for token refresh request
    const refreshOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            grant_type: 'refresh_token',
            refresh_token,
        },
        headers: {
            'Authorization': `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        json: true,
    };

    // Request to refresh the access token
    request.post(refreshOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            access_token = body.access_token;
            res.json({ access_token });
        } else {
            res.status(response.statusCode).send('Failed to refresh access token');
        }
    });
};
