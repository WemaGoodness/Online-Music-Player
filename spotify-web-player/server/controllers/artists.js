const express = require('express');
const request = require('request');
const router = express.Router();

let access_token = ''; // Assume shared access token

// Route to get a specific artist by their ID
router.get('/:id', (req, res) => {
    const artistId = req.params.id;

    request.get({
        url: `https://api.spotify.com/v1/artists/${artistId}`,
        headers: { Authorization: `Bearer ${access_token}` },
        json: true,
    }, (error, response, body) => {
        if (error || response.statusCode !== 200) return res.status(response.statusCode).send('Error fetching artist');
        res.json(body);
    });
});

// Route to get multiple artists by IDs
router.get('/', (req, res) => {
    const artistIds = req.query.ids;

    request.get({
        url: `https://api.spotify.com/v1/artists?ids=${artistIds}`,
        headers: { Authorization: `Bearer ${access_token}` },
        json: true,
    }, (error, response, body) => {
        if (error || response.statusCode !== 200) return res.status(response.statusCode).send('Error fetching artists');
        res.json(body);
    });
});

// Route to get albums of a specific artist by their ID
router.get('/:id/albums', (req, res) => {
    const artistId = req.params.id;

    request.get({
        url: `https://api.spotify.com/v1/artists/${artistId}/albums`,
        headers: { Authorization: `Bearer ${access_token}` },
        json: true,
    }, (error, response, body) => {
        if (error || response.statusCode !== 200) return res.status(response.statusCode).send('Error fetching artist albums');
        res.json(body);
    });
});

// Route to get an artist's top tracks
router.get('/:id/top-tracks', (req, res) => {
    const artistId = req.params.id;

    request.get({
        url: `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
        headers: { Authorization: `Bearer ${access_token}` },
        json: true,
    }, (error, response, body) => {
        if (error || response.statusCode !== 200) return res.status(response.statusCode).send('Error fetching top tracks');
        res.json(body);
    });
});

// Route to get related artists for a specific artist
router.get('/:id/related-artists', (req, res) => {
    const artistId = req.params.id;

    request.get({
        url: `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
        headers: { Authorization: `Bearer ${access_token}` },
        json: true,
    }, (error, response, body) => {
        if (error || response.statusCode !== 200) return res.status(response.statusCode).send('Error fetching related artists');
        res.json(body);
    });
});

// Export router for artist routes
module.exports = router;
