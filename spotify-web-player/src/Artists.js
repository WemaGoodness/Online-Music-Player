import React, { useState, useEffect } from 'react';
import './styles/Artists.css';

function Artists({ token }) {
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [artistAlbums, setArtistAlbums] = useState([]);

  useEffect(() => {
    if (token) {
      // Fetch user's followed artists
      fetch('https://api.spotify.com/v1/me/following?type=artist', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setArtists(data.artists.items);
        })
        .catch((error) => console.error('Error fetching artists:', error));
    }
  }, [token]);

  // Fetch artist's albums
  const fetchArtistAlbums = (artistId) => {
    fetch(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setArtistAlbums(data.items);
        setSelectedArtist(artistId);
      })
      .catch((error) => console.error('Error fetching artist albums:', error));
  };

  return (
    <div className="artists-container">
      <h1>Your Artists</h1>
      <div className="artists-grid">
        {artists.map((artist) => (
          <div key={artist.id} className="artist-item" onClick={() => fetchArtistAlbums(artist.id)}>
            <img src={artist.images[0]?.url} alt={artist.name} />
            <p>{artist.name}</p>
          </div>
        ))}
      </div>
      {selectedArtist && (
        <div className="artist-albums">
          <h2>Albums</h2>
          {artistAlbums.map((album) => (
            <div key={album.id} className="album-item">
              <img src={album.images[0]?.url} alt={album.name} />
              <p>{album.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Artists;
