const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config(); // Load environment variables
const app = express();
const port = 5000; // Server port

// Importing route handlers from different modules
const login = require('./auth/login');
const callback = require('./auth/callback');
const refreshToken = require('./auth/refreshToken');
const albums = require('./controllers/albums');
const artists = require('./controllers/artists');
const playlists = require('./controllers/playlists');
const search = require('./controllers/search');
const tracks = require('./controllers/tracks');

app.use(express.json()); // Parse JSON requests
app.use(express.static(path.join(__dirname, '../build'))); // Serve static files from React app

// Set up authentication routes
app.get('/auth/login', login); // Route to log in to Spotify
app.get('/auth/callback', callback); // Route to handle callback and token exchange
app.get('/auth/token', callback.getToken); // Route to get the access token
app.get('/auth/refresh_token', refreshToken); // Route to refresh access token

// Set up API routes with respective controllers
app.use('/api/albums', albums);
app.use('/api/artists', artists);
app.use('/api/playlists', playlists);
app.use('/api/search', search);
app.use('/api/tracks', tracks);

// Catch-all route for serving the React app's index.html file
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../build', 'index.html')));

// Start the server
app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
