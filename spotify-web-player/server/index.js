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
app.use(express.json()); // To handle JSON in request bodies

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
  const scope = 'user-read-private user-read-email user-library-modify user-library-read user-follow-read user-follow-modify user-read-recently-played user-read-playback-position playlist-modify-public playlist-modify-private streaming'; 
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

/*------------ Refresh Access Token -----------*/
app.get('/auth/refresh_token', (req, res) => {
  const refresh_token = stored_refresh_token;

  const refreshOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
    },
    headers: {
      'Authorization': `Basic ${Buffer.from(`${spotify_client_id}:${spotify_client_secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    json: true,
  };

  request.post(refreshOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      access_token = body.access_token;
      res.json({ access_token });
    } else {
      res.status(response.statusCode).send('Failed to refresh access token');
    }
  });
});

/* ------------------- ALBUM ROUTES ------------------- */
// Get a specific album by ID
app.get('/api/albums/:id', (req, res) => {
  const albumId = req.params.id;
  const albumUrl = `https://api.spotify.com/v1/albums/${albumId}`;

  request.get({
    url: albumUrl,
    headers: { Authorization: `Bearer ${access_token}` },
    json: true,
  }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return res.status(response.statusCode).send('Error fetching album');
    }
    res.json(body);
  });
});

// Get several albums by IDs
app.get('/api/albums', (req, res) => {
  const albumIds = req.query.ids; // Comma-separated list of album IDs
  const albumsUrl = `https://api.spotify.com/v1/albums?ids=${albumIds}`;

  request.get({
    url: albumsUrl,
    headers: { Authorization: `Bearer ${access_token}` },
    json: true,
  }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return res.status(response.statusCode).send('Error fetching albums');
    }
    res.json(body);
  });
});

// Get album tracks
app.get('/api/albums/:id/tracks', (req, res) => {
  const albumId = req.params.id;
  const tracksUrl = `https://api.spotify.com/v1/albums/${albumId}/tracks`;

  request.get({
    url: tracksUrl,
    headers: { Authorization: `Bearer ${access_token}` },
    json: true,
  }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return res.status(response.statusCode).send('Error fetching album tracks');
    }
    res.json(body);
  });
});

// Get user's saved albums
app.get('/api/me/albums', (req, res) => {
  const savedAlbumsUrl = `https://api.spotify.com/v1/me/albums`;

  request.get({
    url: savedAlbumsUrl,
    headers: { Authorization: `Bearer ${access_token}` },
    json: true,
  }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return res.status(response.statusCode).send('Error fetching saved albums');
    }
    res.json(body);
  });
});

// Save albums for the current user
app.post('/api/me/albums', (req, res) => {
  const { ids } = req.body; // Array of album IDs
  const saveAlbumUrl = `https://api.spotify.com/v1/me/albums`;

  request.put({
    url: saveAlbumUrl,
    headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
    json: true,
  }, (error, response) => {
    if (error || response.statusCode !== 200) {
      return res.status(response.statusCode).send('Error saving albums');
    }
    res.status(200).send('Albums saved successfully');
  });
});

// Remove albums from the current user
app.delete('/api/me/albums', (req, res) => {
  const { ids } = req.body; // Array of album IDs
  const removeAlbumsUrl = `https://api.spotify.com/v1/me/albums`;

  request.delete({
    url: removeAlbumsUrl,
    headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
    json: true,
  }, (error, response) => {
    if (error || response.statusCode !== 200) {
      return res.status(response.statusCode).send('Error removing albums');
    }
    res.status(200).send('Albums removed successfully');
  });
});

// Check user's saved albums
app.get('/api/me/albums/contains', (req, res) => {
  const albumIds = req.query.ids; // Comma-separated list of album IDs
  const checkSavedAlbumsUrl = `https://api.spotify.com/v1/me/albums/contains?ids=${albumIds}`;

  request.get({
    url: checkSavedAlbumsUrl,
    headers: { Authorization: `Bearer ${access_token}` },
    json: true,
  }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return res.status(response.statusCode).send('Error checking saved albums');
    }
    res.json(body);
  });
});

// Get new releases
app.get('/api/browse/new-releases', (req, res) => {
  const newReleasesUrl = `https://api.spotify.com/v1/browse/new-releases`;

  request.get({
    url: newReleasesUrl,
    headers: { Authorization: `Bearer ${access_token}` },
    json: true,
  }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return res.status(response.statusCode).send('Error fetching new releases');
    }
    res.json(body);
  });
});

/* ------------------- ARTIST ROUTES ------------------- */
// Get a specific artist by ID
app.get('/api/artists/:id', (req, res) => {
  const artistId = req.params.id;
  const artistUrl = `https://api.spotify.com/v1/artists/${artistId}`;

  request.get({
    url: artistUrl,
    headers: { Authorization: `Bearer ${access_token}` },
    json: true,
  }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return res.status(response.statusCode).send('Error fetching artist');
    }
    res.json(body);
  });
});

// Get several artists by IDs
app.get('/api/artists', (req, res) => {
  const artistIds = req.query.ids; // Comma-separated list of artist IDs
  const artistsUrl = `https://api.spotify.com/v1/artists?ids=${artistIds}`;

  request.get({
    url: artistsUrl,
    headers: { Authorization: `Bearer ${access_token}` },
    json: true,
  }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return res.status(response.statusCode).send('Error fetching artists');
    }
    res.json(body);
  });
});

// Get an artist's albums
app.get('/api/artists/:id/albums', (req, res) => {
  const artistId = req.params.id;
  const albumsUrl = `https://api.spotify.com/v1/artists/${artistId}/albums`;

  request.get({
    url: albumsUrl,
    headers: { Authorization: `Bearer ${access_token}` },
    json: true,
  }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return res.status(response.statusCode).send('Error fetching artist albums');
    }
    res.json(body);
  });
});

// Get an artist's top tracks
app.get('/api/artists/:id/top-tracks', (req, res) => {
  const artistId = req.params.id;
  const topTracksUrl = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`;

  request.get({
    url: topTracksUrl,
    headers: { Authorization: `Bearer ${access_token}` },
    json: true,
  }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return res.status(response.statusCode).send('Error fetching artist top tracks');
    }
    res.json(body);
  });
});

// Get related artists
app.get('/api/artists/:id/related-artists', (req, res) => {
  const artistId = req.params.id;
  const relatedArtistsUrl = `https://api.spotify.com/v1/artists/${artistId}/related-artists`;

  request.get({
    url: relatedArtistsUrl,
    headers: { Authorization: `Bearer ${access_token}` },
    json: true,
  }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return res.status(response.statusCode).send('Error fetching related artists');
    }
    res.json(body);
  });
});

/* ------------------- TRACK ROUTES ------------------- */
// Get a specific track by ID
app.get('/api/tracks/:id', (req, res) => {
  const trackId = req.params.id;
  const trackUrl = `https://api.spotify.com/v1/tracks/${trackId}`;

  request.get({
    url: trackUrl,
    headers: { Authorization: `Bearer ${access_token}` },
    json: true,
  }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return res.status(response.statusCode).send('Error fetching track');
    }
    res.json(body);
  });
});

// Get several tracks by IDs
app.get('/api/tracks', (req, res) => {
  const trackIds = req.query.ids; // Comma-separated list of track IDs
  const tracksUrl = `https://api.spotify.com/v1/tracks?ids=${trackIds}`;

  request.get({
    url: tracksUrl,
    headers: { Authorization: `Bearer ${access_token}` },
    json: true,
  }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return res.status(response.statusCode).send('Error fetching tracks');
    }
    res.json(body);
  });
});

// Get user's saved tracks
app.get('/api/me/tracks', (req, res) => {
  const savedTracksUrl = `https://api.spotify.com/v1/me/tracks`;

  request.get({
    url: savedTracksUrl,
    headers: { Authorization: `Bearer ${access_token}` },
    json: true,
  }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return res.status(response.statusCode).send('Error fetching saved tracks');
    }
    res.json(body);
  });
});

// Save tracks for the current user
app.post('/api/me/tracks', (req, res) => {
  const { ids } = req.body; // Array of track IDs
  const saveTracksUrl = `https://api.spotify.com/v1/me/tracks`;

  request.put({
    url: saveTracksUrl,
    headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
    json: true,
  }, (error, response) => {
    if (error || response.statusCode !== 200) {
      return res.status(response.statusCode).send('Error saving tracks');
    }
    res.status(200).send('Tracks saved successfully');
  });
});

// Remove tracks from the current user
app.delete('/api/me/tracks', (req, res) => {
  const { ids } = req.body; // Array of track IDs
  const removeTracksUrl = `https://api.spotify.com/v1/me/tracks`;

  request.delete({
    url: removeTracksUrl,
    headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
    json: true,
  }, (error, response) => {
    if (error || response.statusCode !== 200) {
      return res.status(response.statusCode).send('Error removing tracks');
    }
    res.status(200).send('Tracks removed successfully');
  });
});

// Check user's saved tracks
app.get('/api/me/tracks/contains', (req, res) => {
  const trackIds = req.query.ids; // Comma-separated list of track IDs
  const checkSavedTracksUrl = `https://api.spotify.com/v1/me/tracks/contains?ids=${trackIds}`;

  request.get({
    url: checkSavedTracksUrl,
    headers: { Authorization: `Bearer ${access_token}` },
    json: true,
  }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return res.status(response.statusCode).send('Error checking saved tracks');
    }
    res.json(body);
  });
});

/* ------------------- PLAYLIST ROUTES ------------------- */
// Get a playlist by ID
app.get('/api/playlists/:id', (req, res) => {
  const playlistId = req.params.id;
  const playlistUrl = `https://api.spotify.com/v1/playlists/${playlistId}`;

  request.get({
    url: playlistUrl,
    headers: { Authorization: `Bearer ${access_token}` },
    json: true,
  }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return res.status(response.statusCode).send('Error fetching playlist');
    }
    res.json(body);
  });
});

// Change playlist details
app.put('/api/playlists/:id', (req, res) => {
  const playlistId = req.params.id;
  const { name, description, publicStatus } = req.body;

  const changePlaylistDetailsUrl = `https://api.spotify.com/v1/playlists/${playlistId}`;

  request.put({
    url: changePlaylistDetailsUrl,
    headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name || 'New Playlist Name',
      description: description || 'Updated via API',
      public: publicStatus || false,
    }),
    json: true,
  }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return res.status(response.statusCode).send('Error changing playlist details');
    }
    res.json(body);
  });
});

// Get playlist items (tracks)
app.get('/api/playlists/:id/tracks', (req, res) => {
  const playlistId = req.params.id;
  const tracksUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

  request.get({
    url: tracksUrl,
    headers: { Authorization: `Bearer ${access_token}` },
    json: true,
  }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return res.status(response.statusCode).send('Error fetching playlist tracks');
    }
    res.json(body);
  });
});

// Add a custom playlist cover image
app.put('/api/playlists/:id/images', (req, res) => {
  const playlistId = req.params.id;
  const base64Image = req.body.image; // Base64 encoded image

  const addCoverUrl = `https://api.spotify.com/v1/playlists/${playlistId}/images`;

  request.put({
    url: addCoverUrl,
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'image/jpeg',
    },
    body: base64Image,
  }, (error, response) => {
    if (error || response.statusCode !== 202) {
      return res.status(response.statusCode).send('Error uploading playlist cover image');
    }
    res.status(202).send('Cover image uploaded successfully');
  });
});

// Route to handle search requests from the frontend
app.get('/api/search', (req, res) => {
  const { q, type } = req.query;

  if (!q || !type) {
    return res.status(400).json({ error: 'Missing search query or type' });
  }

  if (!access_token) {
    return res.status(401).json({ error: 'Access token is missing. Please authenticate.' });
  }

  const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=${type}&limit=10`;

  request.get({
    url: searchUrl,
    headers: { Authorization: `Bearer ${access_token}` },
    json: true,
  }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return res.status(response.statusCode).send('Error fetching search results');
    }

    res.json(body);
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
