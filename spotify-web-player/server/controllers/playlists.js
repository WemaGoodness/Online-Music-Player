const express = require('express');
const request = require('request');
const router = express.Router();

let access_token = ''; // Assume shared access token

// Route to get a specific playlist by its ID
router.get('/:id', (req, res) => {
    const playlistId = req.params.id;

    request.get({
        url: `https://api.spotify.com/v1/playlists/${playlistId}`,
        headers: { Authorization: `Bearer ${access_token}` },
        json: true,
    }, (error, response, body) => {
        if (error || response.statusCode !== 200) return res.status(response.statusCode).send('Error fetching playlist');
        res.json(body);
    });
});

// Route to modify playlist details
router.put('/:id', (req, res) => {
    const playlistId = req.params.id;
    const { name, description, publicStatus } = req.body;

    request.put({
        url: `https://api.spotify.com/v1/playlists/${playlistId}`,
        headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name || 'New Playlist Name',
            description: description || 'Updated via API',
            public: publicStatus || false
        }),
        json: true,
    }, (error, response, body) => {
        if (error || response.statusCode !== 200) return res.status(response.statusCode).send('Error updating playlist');
        res.json(body);
    });
});

// Route to get playlist tracks
router.get('/:id/tracks', (req, res) => {
    const playlistId = req.params.id;

    request.get({
        url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        headers: { Authorization: `Bearer ${access_token}` },
        json: true,
    }, (error, response, body) => {
        if (error || response.statusCode !== 200) return res.status(response.statusCode).send('Error fetching playlist tracks');
        res.json(body);
    });
});

// Route to add a custom playlist cover image
router.put('/:id/images', (req, res) => {
    const playlistId = req.params.id;
    const base64Image = req.body.image;

    request.put({
        url: `https://api.spotify.com/v1/playlists/${playlistId}/images`,
        headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'image/jpeg'
        },
        body: base64Image,
    }, (error, response) => {
        if (error || response.statusCode !== 202) return res.status(response.statusCode).send('Error uploading playlist cover image');
        res.status(202).send('Cover image uploaded successfully');
    });
});

// Export router for playlist routes
module.exports = router;
