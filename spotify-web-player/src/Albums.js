import React, { useState, useEffect } from 'react';
import './styles/Albums.css';

function Albums({ token }) {
  const [albums, setAlbums] = useState([]);
  const [albumTracks, setAlbumTracks] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  useEffect(() => {
    if (token) {
      // Fetch user's saved albums
      fetch('https://api.spotify.com/v1/me/albums', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setAlbums(data.items);
        })
        .catch((error) => console.error('Error fetching albums:', error));
    }
  }, [token]);

  // Fetch album tracks when an album is selected
  const fetchAlbumTracks = (albumId) => {
    fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAlbumTracks(data.items);
        setSelectedAlbum(albumId);
      })
      .catch((error) => console.error('Error fetching album tracks:', error));
  };

  return (
    <div className="albums-container">
      <h1>Your Albums</h1>
      <div className="albums-grid">
        {albums.map((album) => (
          <div key={album.album.id} className="album-item" onClick={() => fetchAlbumTracks(album.album.id)}>
            <img src={album.album.images[0]?.url} alt={album.album.name} />
            <p>{album.album.name}</p>
            <p>{album.album.artists[0]?.name}</p>
          </div>
        ))}
      </div>
      {selectedAlbum && (
        <div className="album-tracks">
          <h2>Album Tracks</h2>
          {albumTracks.map((track) => (
            <div key={track.id} className="track-item">
              <p>{track.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Albums;
