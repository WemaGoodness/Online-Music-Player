const request = require('request');

// Function to get Spotify access token and refresh if needed
let accessToken = '';
let tokenExpirationTime = 0;

const getSpotifyAccessToken = async () => {
    if (accessToken && Date.now() < tokenExpirationTime) {
        return accessToken;
    }

    return new Promise((resolve, reject) => {
        request.post(
            {
                url: 'https://accounts.spotify.com/api/token',
                form: {
                    grant_type: 'client_credentials',
                    client_id: process.env.SPOTIFY_CLIENT_ID,
                    client_secret: process.env.SPOTIFY_CLIENT_SECRET,
                },
                json: true,
            },
            (error, response, body) => {
                if (error || response.statusCode !== 200) {
                    return reject(new Error('Failed to retrieve access token'));
                }
                accessToken = body.access_token;
                tokenExpirationTime = Date.now() + body.expires_in * 1000;
                resolve(accessToken);
            }
        );
    });
};

module.exports = { getSpotifyAccessToken };
