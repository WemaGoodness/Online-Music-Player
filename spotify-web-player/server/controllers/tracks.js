const express = require('express');
const request = require('request');
const router = express.Router();

let access_token = ''; // Assume shared access token

// Route to get a specific track by its ID
router.get('/:id', (req, res) => {
    const trackId = req.params.id;

    request.get({
        url: `https://api.spotify.com/v1/tracks/${trackId}`,
        headers: { Authorization: `Bearer ${access_token}` },
        json: true,
    }, (error, response, body) => {
        if (error || response.statusCode !== 200) return res.status(response.statusCode).send('Error fetching track');
        res.json(body);
    });
});

// Route to get multiple tracks by IDs
router.get('/', (req, res) => {
    const trackIds = req.query.ids;

    request.get({
        url: `https://api.spotify.com/v1/tracks?ids=${trackIds}`,
        headers: { Authorization: `Bearer ${access_token}` },
        json: true,
    }, (error, response, body) => {
        if (error || response.statusCode !== 200) return res.status(response.statusCode).send('Error fetching tracks');
        res.json(body);
    });
});

// Route to get saved tracks for the user
router.get('/me/tracks', (req, res) => {
    request.get({
        url: 'https://api.spotify.com/v1/me/tracks',
        headers: { Authorization: `Bearer ${access_token}` },
        json: true,
    }, (error, response, body) => {
        if (error || response.statusCode !== 200) return res.status(response.statusCode).send('Error fetching saved tracks');
        res.json(body);
    });
});

// Route to save tracks for the user
router.post('/me/tracks', (req, res) => {
    const { ids } = req.body;

    request.put({
        url: 'https://api.spotify.com/v1/me/tracks',
        headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
        json: true,
    }, (error, response) => {
        if (error || response.statusCode !== 200) return res.status(response.statusCode).send('Error saving tracks');
        res.status(200).send('Tracks saved successfully');
    });
});

// Route to remove saved tracks for the user
router.delete('/me/tracks', (req, res) => {
    const { ids } = req.body;

    request.delete({
        url: 'https://api.spotify.com/v1/me/tracks',
        headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
        json: true,
    }, (error, response) => {
        if (error || response.statusCode !== 200) return res.status(response.statusCode).send('Error removing tracks');
        res.status(200).send('Tracks removed successfully');
    });
});

// Export router for track routes
module.exports = router;
