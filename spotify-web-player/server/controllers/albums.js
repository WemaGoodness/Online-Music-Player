const express = require('express');
const request = require('request');
const router = express.Router();

let access_token = ''; // Assume shared access token

// Route to get a specific album by its ID
router.get('/:id', (req, res) => {
    const albumId = req.params.id; // Extract album ID from request parameters

    request.get({
        url: `https://api.spotify.com/v1/albums/${albumId}`,
        headers: { Authorization: `Bearer ${access_token}` },
        json: true,
    }, (error, response, body) => {
        if (error || response.statusCode !== 200) return res.status(response.statusCode).send('Error fetching album');
        res.json(body); // Send album data as JSON
    });
});

// Route to get multiple albums by IDs
router.get('/', (req, res) => {
    const albumIds = req.query.ids; // Comma-separated list of album IDs

    request.get({
        url: `https://api.spotify.com/v1/albums?ids=${albumIds}`,
        headers: { Authorization: `Bearer ${access_token}` },
        json: true,
    }, (error, response, body) => {
        if (error || response.statusCode !== 200) return res.status(response.statusCode).send('Error fetching albums');
        res.json(body); // Send albums data as JSON
    });
});

// Route to get tracks of a specific album by its ID
router.get('/:id/tracks', (req, res) => {
    const albumId = req.params.id;

    request.get({
        url: `https://api.spotify.com/v1/albums/${albumId}/tracks`,
        headers: { Authorization: `Bearer ${access_token}` },
        json: true,
    }, (error, response, body) => {
        if (error || response.statusCode !== 200) return res.status(response.statusCode).send('Error fetching album tracks');
        res.json(body); // Send tracks data as JSON
    });
});

// Export router for albums routes
module.exports = router;
