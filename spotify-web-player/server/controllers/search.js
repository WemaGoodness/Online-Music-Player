const express = require('express');
const request = require('request');
const router = express.Router();
const { getSpotifyAccessToken } = require('../models/auth'); // Function to get Spotify token

// Route to handle search requests
router.get('/', async (req, res) => {
    const { q, type } = req.query;

    if (!q || !type) {
        return res.status(400).json({ error: 'Missing search query or type' });
    }

    try {
        // Retrieve a valid access token
        const accessToken = await getSpotifyAccessToken();

        // Spotify API URL for searching
        const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=${type}&limit=10`;

        // Perform the search request
        request.get(
            {
                url: searchUrl,
                headers: { Authorization: `Bearer ${accessToken}` },
                json: true,
            },
            (error, response, body) => {
                if (error || response.statusCode !== 200) {
                    return res.status(response.statusCode).json({ error: body.error.message || 'Error fetching search results' });
                }
                res.json(body); // Send the search results back to the client
            }
        );
    } catch (error) {
        console.error('Error in search route:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
