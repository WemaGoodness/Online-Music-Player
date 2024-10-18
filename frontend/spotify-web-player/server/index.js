// Import required dependencies
const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

const app = express(); // Create an instance of Express
const port = process.env.PORT || 5000; // Set port from environment variable or default to 5000

// Spotify client credentials
const spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;

// Serve the static React frontend from the build folder
app.use(express.static(path.join(__dirname, '../build')));

// Helper function to generate a random string for state parameter
function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text; // Return the generated string
}

// Route to initiate Spotify login (OAuth PKCE flow)
app.get('/auth/login', (req, res) => {
  const scope = 'streaming user-read-email user-read-private'; // Define the required scopes
  const state = generateRandomString(16); // Generate a random state string

  // Construct the authorization query parameters
  const authQueryParams = new URLSearchParams({
    response_type: 'code',
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: 'http://localhost:3000/auth/callback', // Redirect URI after login
    state: state,
  });

  // Redirect to Spotify's authorization page
  res.redirect(`https://accounts.spotify.com/authorize?${authQueryParams.toString()}`);
});

// Callback route to handle Spotify OAuth callback
app.get('/auth/callback', async (req, res) => {
  const code = req.query.code; // Get the authorization code from the query parameters

  try {
    // Exchange the authorization code for an access token
    const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
      code: code,
      redirect_uri: 'http://localhost:3000/auth/callback',
      grant_type: 'authorization_code',
    }).toString(), {
      headers: {
        Authorization: `Basic ${Buffer.from(`${spotify_client_id}:${spotify_client_secret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const access_token = tokenResponse.data.access_token; // Extract access token from response

    // Instead of redirecting with token in the URL, we will send the token to the frontend
    res.redirect(`/dashboard?token=${access_token}`); // Redirect to dashboard with token as a query parameter
  } catch (error) {
    console.error('Error fetching access token:', error);
    res.status(500).json({ message: 'Error fetching access token' }); // Handle errors
  }
});

// Route to serve the React app for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html')); // Serve the main HTML file
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`); // Log server start message
});
