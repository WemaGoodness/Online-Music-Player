const express = require('express');
const request = require('request');
const router = express.Router();

let access_token = ''; // Shared access token for Spotify API requests

// Route to get the current user's playlists
router.get('/user', (req, res) => {
    request.get({
        url: 'https://api.spotify.com/v1/me/playlists',
        headers: { Authorization: `Bearer ${access_token}` },
        json: true,
    }, (error, response, body) => {
        if (error || response.statusCode !== 200) {
            return res.status(response.statusCode).send('Error fetching user playlists');
        }
        res.json(body);
    });
});

// Route to get details of a specific playlist
router.get('/:id', (req, res) => {
    const playlistId = req.params.id;

    request.get({
        url: `https://api.spotify.com/v1/playlists/${playlistId}`,
        headers: { Authorization: `Bearer ${access_token}` },
        json: true,
    }, (error, response, body) => {
        if (error || response.statusCode !== 200) {
            return res.status(response.statusCode).send('Error fetching playlist details');
        }
        res.json(body);
    });
});

// Route to create a new playlist for the current user
router.post('/create', (req, res) => {
    const { name, description } = req.body;

    request.post({
        url: 'https://api.spotify.com/v1/me/playlists',
        headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
    }, (error, response, body) => {
        if (error || response.statusCode !== 201) {
            return res.status(response.statusCode).send('Error creating playlist');
        }
        res.json(JSON.parse(body));
    });
});

// Route to add tracks to a playlist
router.post('/:id/tracks', (req, res) => {
    const playlistId = req.params.id;
    const { uris } = req.body;

    request.post({
        url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uris }),
    }, (error, response, body) => {
        if (error || response.statusCode !== 201) {
            return res.status(response.statusCode).send('Error adding tracks to playlist');
        }
        res.json(JSON.parse(body));
    });
});

module.exports = router;
