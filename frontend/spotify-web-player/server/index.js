const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const URLSearchParams = require('url').URLSearchParams;
const request = require('request');

dotenv.config();

const port = 5000;

// Spotify credentials from the .env file
var spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;

var access_token = ''; // To store the Spotify access token

var app = express();

// Serve the static files from the React app build folder
app.use(express.static(path.join(__dirname, '../build')));

// Function to generate a random string for the state parameter
var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// Route for Spotify login
app.get('/auth/login', (req, res) => {
  var scope = 'streaming user-read-email user-read-private'; // Spotify permissions
  var state = generateRandomString(16); // Generate a random state to prevent CSRF attacks

  var auth_query_parameters = new URLSearchParams({
    response_type: 'code',
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: 'http://localhost:5000/auth/callback', // Redirect URI must match with Spotify dashboard
    state: state
  });

  // Redirect to Spotify's authorization endpoint
  res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
});

// Callback route for Spotify
app.get('/auth/callback', (req, res) => {
  var code = req.query.code; // Get the authorization code from query params

  // Spotify token exchange options
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: "http://localhost:5000/auth/callback", // Should match with the redirect URI
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    json: true
  };

  // Request to exchange authorization code for access token
  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      access_token = body.access_token; // Store the access token
      res.redirect('/'); // Redirect to the homepage after successful login
    } else {
      res.status(response.statusCode).send("Failed to authenticate with Spotify");
    }
  });
});

// Route to return the access token as JSON
app.get('/auth/token', (req, res) => {
  res.json({
    access_token: access_token // Respond with the stored access token
  });
});

// Catch-all route to serve the React app for any unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Start the Express server
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
