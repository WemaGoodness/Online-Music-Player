// ~/Online-Music-Player/spotify-web-player/src/Playlists.js
import React, { useEffect, useState } from 'react';
import './styles/Playlists.css';

function Playlists({ token }) {
  const [playlists, setPlaylists] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const [description, setDescription] = useState('');

  // Function to fetch the user's playlists
  const fetchUserPlaylists = async () => {
    try {
      const response = await fetch(`/api/playlists/user`);
      const data = await response.json();
      setPlaylists(data.items);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserPlaylists();
    }
  }, [token]);

  // Function to handle playlist creation
  const createPlaylist = async () => {
    try {
      await fetch('/api/playlists/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: playlistName,
          description,
        }),
      });
      setPlaylistName('');
      setDescription('');
      fetchUserPlaylists(); // Refresh playlists after creation
    } catch (error) {
      console.error("Error creating playlist:", error);
    }
  };

  return (
    <div className="playlists-container">
      <h1>Your Playlists</h1>
      <div className="create-playlist">
        <input
          type="text"
          placeholder="Playlist Name"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={createPlaylist}>Create Playlist</button>
      </div>
      <ul className="playlist-list">
        {playlists.map((playlist) => (
          <li key={playlist.id}>
            <img src={playlist.images[0]?.url} alt="Playlist cover" />
            <h3>{playlist.name}</h3>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Playlists;
