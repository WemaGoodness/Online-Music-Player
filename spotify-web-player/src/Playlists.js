import React, { useState, useEffect } from 'react';
import './styles/Playlists.css';

function Playlists({ token }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (token) {
      setLoading(true); // Set loading state to true when starting
      fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.items) {
            setPlaylists(data.items);
          } else {
            setError(true); // Trigger error if no items returned
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching playlists:', error);
          setError(true); // Set error state on fetch failure
          setLoading(false);
        });
    }
  }, [token]);

  return (
    <div className="playlists-container">
      <h1>Your Playlists</h1>
      {loading ? (
        <p>Loading playlists...</p>
      ) : error ? (
        <p>There was an error loading your playlists. Please try again.</p>
      ) : playlists.length ? (
        <div className="playlists-grid">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="playlist-item">
              <img src={playlist.images[0]?.url} alt={playlist.name} />
              <div className="playlist-details">
                <p>{playlist.name}</p>
                <p>{playlist.tracks.total} songs</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No playlists found.</p>
      )}
    </div>
  );
}

export default Playlists;
