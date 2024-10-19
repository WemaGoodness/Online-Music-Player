import React, { useState, useEffect } from 'react';

function Playlists({ token }) {
  const [playlists, setPlaylists] = useState([]); // Store user playlists

  useEffect(() => {
    async function fetchPlaylists() {
      const response = await fetch('https://api.spotify.com/v1/me/playlists', {
        headers: { Authorization: `Bearer ${token}` }, // Use token in request
      });
      const data = await response.json(); // Parse response
      setPlaylists(data.items); // Set playlists data
    }

    fetchPlaylists(); // Fetch playlists on mount
  }, [token]); // Rerun when token changes

  return (
    <div className="playlists-container">
      <h1>Your Playlists</h1>
      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.id}>
            <img src={playlist.images[0]?.url} alt={playlist.name} /> {/* Playlist cover */}
            <p>{playlist.name}</p> {/* Playlist name */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Playlists;
