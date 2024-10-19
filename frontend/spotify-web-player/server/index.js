const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const request = require('request');
const { URLSearchParams } = require('url');

dotenv.config();

const port = 5000;
let access_token = ''; // Store the Spotify access token

// Spotify credentials
const spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../build')));

// Generate a random string for state verification (security)
const generateRandomString = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// Spotify Login Route
app.get('/auth/login', (req, res) => {
  const scope = 'streaming user-read-email user-read-private playlist-modify-public playlist-modify-private'; // Spotify permissions
  const state = generateRandomString(16); // State to prevent CSRF

  const authQueryParams = new URLSearchParams({
    response_type: 'code',
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: 'http://localhost:5000/auth/callback',
    state: state,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${authQueryParams.toString()}`);
});

// Spotify Callback Route for Token Exchange
app.get('/auth/callback', (req, res) => {
  const code = req.query.code; // Authorization code

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: 'http://localhost:5000/auth/callback',
      grant_type: 'authorization_code',
    },
    headers: {
      'Authorization': `Basic ${Buffer.from(`${spotify_client_id}:${spotify_client_secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    json: true,
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      access_token = body.access_token; // Store access token
      res.redirect('/'); // Redirect to the main app
    } else {
      res.status(response.statusCode).send('Failed to authenticate with Spotify');
    }
  });
});

// Route to return the access token
app.get('/auth/token', (req, res) => {
  res.json({ access_token: access_token });
});

// Search API Route (Tracks, Artists, Albums)
app.get('/api/search', (req, res) => {
  const query = req.query.q;
  const type = req.query.type; // Can be 'track', 'artist', 'album'

  if (!query || !type) {
    return res.status(400).send('Missing query or type parameters');
  }

  const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=10`;

  const options = {
    url: searchUrl,
    headers: { Authorization: `Bearer ${access_token}` },
    json: true,
  };

  request.get(options, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return res.status(response.statusCode).send('Error fetching search results');
    }
    res.json(body);
  });
});

// Playlist Creation API Route
app.post('/api/create-playlist', (req, res) => {
  const { userId, name, description } = req.body;

  const createPlaylistUrl = `https://api.spotify.com/v1/users/${userId}/playlists`;

  const options = {
    url: createPlaylistUrl,
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name || 'New Playlist',
      description: description || 'Created via Spotify Web API',
      public: false,
    }),
  };

  request.post(options, (error, response, body) => {
    if (error || response.statusCode !== 201) {
      return res.status(response.statusCode).send('Error creating playlist');
    }
    res.json(JSON.parse(body));
  });
});

// Add Tracks to Playlist API Route
app.post('/api/add-to-playlist', (req, res) => {
  const { playlistId, uris } = req.body;

  const addTracksUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

  const options = {
    url: addTracksUrl,
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uris }),
  };

  request.post(options, (error, response, body) => {
    if (error || response.statusCode !== 201) {
      return res.status(response.statusCode).send('Error adding tracks to playlist');
    }
    res.json(JSON.parse(body));
  });
});

// Remove Tracks from Playlist API Route
app.delete('/api/remove-from-playlist', (req, res) => {
  const { playlistId, uris } = req.body;

  const removeTracksUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

  const options = {
    url: removeTracksUrl,
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tracks: uris.map(uri => ({ uri })) }),
  };

  request.delete(options, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return res.status(response.statusCode).send('Error removing tracks from playlist');
    }
    res.json(JSON.parse(body));
  });
});

// Catch-all route to serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Start the Express server
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
