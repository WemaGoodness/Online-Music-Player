const express = require('express');
const request = require('request');
const router = express.Router();

let access_token = ''; // Assume shared access token

// Route to handle search requests
router.get('/', (req, res) => {
    const { q, type } = req.query;

    if (!q || !type) {
        return res.status(400).json({ error: 'Missing search query or type' });
    }

    const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=${type}&limit=10`;

    request.get({
        url: searchUrl,
        headers: { Authorization: `Bearer ${access_token}` },
        json: true,
    }, (error, response, body) => {
        if (error || response.statusCode !== 200) return res.status(response.statusCode).send('Error fetching search results');
        res.json(body);
    });
});

// Export router for search route
module.exports = router;
