const express = require('express');
const request = require('request');
const Playlist = require('../models/Playlists');
const Track = require('../models/Tracks');
const router = express.Router();
let access_token = ''; // Shared Spotify access token

// Fetch Spotify and MongoDB playlists for a user
router.get('/user', async (req, res) => {
  try {
    // Fetch Spotify playlists
    const spotifyResponse = await fetchSpotifyPlaylists(access_token);
    const spotifyPlaylists = spotifyResponse.items;

    // Fetch MongoDB playlists
    const mongoPlaylists = await Playlist.find({ userId: req.query.userId }).populate('tracks');

    res.json({ spotifyPlaylists, mongoPlaylists });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching playlists' });
  }
});

// Helper to fetch Spotify playlists
const fetchSpotifyPlaylists = (accessToken) => {
  return new Promise((resolve, reject) => {
    request.get({
      url: 'https://api.spotify.com/v1/me/playlists',
      headers: { Authorization: `Bearer ${accessToken}` },
      json: true,
    }, (error, response, body) => {
      if (error || response.statusCode !== 200) reject(error || response.statusCode);
      resolve(body);
    });
  });
};

// Create a new MongoDB playlist
router.post('/create', async (req, res) => {
  const { name, description, userId } = req.body;
  try {
    const newPlaylist = await Playlist.create({ name, description, userId });
    res.json(newPlaylist);
  } catch (error) {
    res.status(500).json({ error: 'Error creating playlist' });
  }
});

// Add tracks to MongoDB playlist
router.post('/:id/tracks', async (req, res) => {
  const playlistId = req.params.id;
  const { trackUri, name, album, artists, durationMs, previewUrl } = req.body;

  try {
    const track = await Track.create({ spotifyUri: trackUri, name, album, artists, durationMs, previewUrl });
    await Playlist.findByIdAndUpdate(playlistId, { $push: { tracks: track._id } });
    res.json(track);
  } catch (error) {
    res.status(500).json({ error: 'Error adding track to playlist' });
  }
});

module.exports = router;
