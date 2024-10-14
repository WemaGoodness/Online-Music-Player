const SpotifyWebApi = require('spotify-web-api-node');

// method to initialize the Spotify API client with environment variables
const initialize_spotify_api = () => {
    return new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,        // load client ID from environment
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET, // load client secret from environment
        redirectUri: process.env.SPOTIFY_REDIRECT_URI,   // load redirect URI from environment
    });
};

// method to get the authorization URL to authenticate with Spotify
const get_spotify_auth_url = (req, res) => {
    const spotify_api = initialize_spotify_api();  // initialize API here with env vars
    const scopes = ['user-read-private', 'user-read-email', 'playlist-read-private', 'playlist-read-collaborative', 'user-library-read'];

    // generate an authorization URL to initiate OAuth 2.0
    const auth_url = spotify_api.createAuthorizeURL(scopes);
    res.redirect(auth_url); // redirect user to Spotify's auth page
};

// method to handle Spotify callback and retrieve access token
const spotify_callback = async (req, res) => {
    const spotify_api = initialize_spotify_api();  // initialize API here with env vars
    const code = req.query.code; // get the authorization code from Spotify

    try {
        // exchange authorization code for access token
        const data = await spotify_api.authorizationCodeGrant(code);
        
        // set access token and refresh token in the Spotify API client
        spotify_api.setAccessToken(data.body['access_token']);
        spotify_api.setRefreshToken(data.body['refresh_token']);

        res.status(200).json({ message: 'Spotify authentication successful', access_token: data.body['access_token'] });
    } catch (error) {
        res.status(400).json({ message: 'Spotify authentication failed', error });
    }
};

// method to search for tracks on Spotify
const search_tracks = async (req, res) => {
    const spotify_api = initialize_spotify_api();  // initialize API here with env vars
    const track_name = req.query.q; // get the search query (track name)

    try {
        // search for tracks using the Spotify API
        const data = await spotify_api.searchTracks(track_name);
        
        // send back the first 10 tracks found
        res.status(200).json({ tracks: data.body.tracks.items.slice(0, 10) });
    } catch (error) {
        res.status(400).json({ message: 'Error searching tracks', error });
    }
};

// export the functions to be used in routes
module.exports = {
    get_spotify_auth_url,
    spotify_callback,
    search_tracks,
};
