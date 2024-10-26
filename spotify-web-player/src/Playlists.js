import React, { useEffect, useState } from 'react';
import './styles/Playlists.css';

function Playlists({ token, userId, playTrack }) {
  const [spotifyPlaylists, setSpotifyPlaylists] = useState([]);
  const [mongoPlaylists, setMongoPlaylists] = useState([]);

  useEffect(() => {
    async function fetchPlaylists() {
      const response = await fetch(`/api/playlists/user?userId=${userId}`);
      const { spotifyPlaylists, mongoPlaylists } = await response.json();
      setSpotifyPlaylists(spotifyPlaylists);
      setMongoPlaylists(mongoPlaylists);
    }

    if (token) fetchPlaylists();
  }, [token, userId]);

  return (
    <div className="playlists-container">
      <h2>Your Spotify Playlists</h2>
      <ul className="playlist-list">
        {spotifyPlaylists.map((playlist) => (
          <li
            key={playlist.id}
            onClick={() => playTrack(playlist.tracks.items[0]?.track.uri)} // Play first track in playlist
          >
            <img src={playlist.images[0]?.url} alt="Playlist cover" />
            <h3>{playlist.name}</h3>
          </li>
        ))}
      </ul>

      <h2>Your Created Playlists</h2>
      <ul className="playlist-list">
        {mongoPlaylists.map((playlist) => (
          <li
            key={playlist._id}
            onClick={() => playTrack(playlist.tracks[0]?.uri)} // Play first track in custom playlist
          >
            <h3>{playlist.name}</h3>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Playlists;
