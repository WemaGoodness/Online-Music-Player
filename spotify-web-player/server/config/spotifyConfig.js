// spotifyConfig.js - Configuration file to hold Spotify credentials from environment variables
const spotifyConfig = {
    client_id: process.env.SPOTIFY_CLIENT_ID, // Spotify Client ID
    client_secret: process.env.SPOTIFY_CLIENT_SECRET, // Spotify Client Secret
    redirect_uri: 'http://localhost:5000/auth/callback' // Redirect URI after Spotify login
};

module.exports = spotifyConfig; // Export configuration object
