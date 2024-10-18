const axios = require('axios');
const { URLSearchParams } = require('url');

// Dynamically import the pkce-challenge module
let pkce_challenge;
(async () => {
    pkce_challenge = (await import('pkce-challenge')).default;
})();

// Generate Spotify authorization URL for PKCE flow
const generate_spotify_auth_url = (req, res) => {
    // Ensure pkce_challenge is loaded
    if (!pkce_challenge) {
        return res.status(500).json({ message: 'PKCE challenge module not loaded' });
    }

    // Generate PKCE code verifier and challenge
    const challenge = pkce_challenge();

    // Store the code verifier in the session for later verification
    req.session.code_verifier = challenge.code_verifier;

    // Log session data to verify if code_verifier is stored correctly
    console.log('Session after setting code_verifier:', req.session);

    // Construct Spotify authorization URL with required parameters
    const auth_url = `https://accounts.spotify.com/authorize?${new URLSearchParams({
        client_id: process.env.SPOTIFY_CLIENT_ID,
        response_type: 'code',
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        code_challenge_method: 'S256',
        code_challenge: challenge.code_challenge,
        scope: 'playlist-modify-public playlist-modify-private user-read-email user-read-playback-state user-modify-playback-state',
    }).toString()}`;

    // Redirect user to Spotify login page
    res.redirect(auth_url);
};

// Handle Spotify callback and exchange authorization code for access token
const handle_spotify_callback = async (req, res) => {
    const { code } = req.query;

    try {
        // Log session to check if code_verifier is available
        console.log('Session at callback:', req.session);
        const code_verifier = req.session.code_verifier;

        if (!code_verifier) {
            return res.status(400).json({ message: 'Code verifier missing from session' });
        }

        // Exchange authorization code for access token using Spotify API
        const response = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
            client_id: process.env.SPOTIFY_CLIENT_ID,
            grant_type: 'authorization_code',
            code,
            redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
            code_verifier: code_verifier,
        }).toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        // Store access and refresh tokens in session
        req.session.access_token = response.data.access_token;
        req.session.refresh_token = response.data.refresh_token;

        res.status(200).json({ message: 'Spotify authentication successful', access_token: response.data.access_token });
    } catch (error) {
        console.error('Error exchanging authorization code:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Error exchanging authorization code', error: error.message });
    }
};

// Create a new Spotify playlist after user is authenticated
const create_spotify_playlist = async (req, res) => {
    const { name, description, public_playlist } = req.body;
    const access_token = req.session.access_token;

    try {
        // Get user profile from Spotify to retrieve user ID
        const user_profile = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        const user_id = user_profile.data.id;

        // Create a new playlist using Spotify API
        const playlist_response = await axios.post(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
            name,
            description,
            public: public_playlist || false,
        }, {
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
        });

        res.status(201).json(playlist_response.data); // Send newly created playlist data
    } catch (error) {
        console.error('Error creating playlist:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Error creating Spotify playlist', error: error.message });
    }
};

// Fetch user's Spotify playlists
const get_user_playlists = async (req, res) => {
    const access_token = req.session.access_token;

    try {
        const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        res.status(200).json(response.data.items); // Send user's playlists
    } catch (error) {
        console.error('Error fetching playlists:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Error fetching playlists', error: error.message });
    }
};

// Search for artists, albums, or tracks on Spotify
const search_spotify = async (req, res) => {
    const access_token = req.session.access_token;
    const { query, type } = req.query; // Search query and type (artist, album, or track)

    try {
        const response = await axios.get(`https://api.spotify.com/v1/search?${new URLSearchParams({
            q: query,
            type: type,  // Search for 'artist', 'album', or 'track'
            limit: 10,
        })}`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        res.status(200).json(response.data); // Send search results
    } catch (error) {
        console.error('Error searching Spotify:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Error searching Spotify', error: error.message });
    }
};

// Play a track on Spotify
const play_track = async (req, res) => {
    const access_token = req.session.access_token;
    const { track_uri } = req.body;

    try {
        // Send request to Spotify to play the specified track
        await axios.put('https://api.spotify.com/v1/me/player/play', { uris: [track_uri] }, {
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
        });

        res.status(204).send(); // Send no content response
    } catch (error) {
        console.error('Error playing track:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Error playing track', error: error.message });
    }
};

// Pause playback on Spotify
const pause_playback = async (req, res) => {
    const access_token = req.session.access_token;

    try {
        await axios.put('https://api.spotify.com/v1/me/player/pause', {}, {
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
        });

        res.status(204).send(); // Send no content response
    } catch (error) {
        console.error('Error pausing playback:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Error pausing playback', error: error.message });
    }
};

// Resume playback on Spotify
const resume_playback = async (req, res) => {
    const access_token = req.session.access_token;

    try {
        await axios.put('https://api.spotify.com/v1/me/player/play', {}, {
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
        });

        res.status(204).send(); // Send no content response
    } catch (error) {
        console.error('Error resuming playback:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Error resuming playback', error: error.message });
    }
};

// Seek to a specific position in the track
const seek_playback = async (req, res) => {
    const access_token = req.session.access_token;
    const { position_ms } = req.body;

    try {
        // Seek to the specified position in the track
        await axios.put(`https://api.spotify.com/v1/me/player/seek?position_ms=${position_ms}`, {}, {
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
        });

        res.status(204).send(); // Send no content response
    } catch (error) {
        console.error('Error seeking playback:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Error seeking playback', error: error.message });
    }
};

module.exports = {
    generate_spotify_auth_url,
    handle_spotify_callback,
    create_spotify_playlist,
    get_user_playlists,
    search_spotify,
    play_track,
    pause_playback,
    resume_playback,
    seek_playback,
};
