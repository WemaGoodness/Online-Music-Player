import React, { useState, useEffect } from 'react';
import './styles/Tracks.css';

function Tracks({ token, playTrack }) {
  const [tracks, setTracks] = useState([]);
  const [audioFeatures, setAudioFeatures] = useState([]);

  useEffect(() => {
    if (token) {
      fetch('https://api.spotify.com/v1/me/tracks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setTracks(data.items);
        })
        .catch((error) => console.error('Error fetching tracks:', error));
    }
  }, [token]);

  const fetchTrackAudioFeatures = (trackIds) => {
    fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIds}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAudioFeatures(data.audio_features);
      })
      .catch((error) => console.error('Error fetching audio features:', error));
  };

  return (
    <div className="tracks-container">
      <h1>Your Tracks</h1>
      <div className="tracks-grid">
        {tracks.map((track) => (
          <div key={track.track.id} className="track-item">
            <img src={track.track.album.images[0]?.url} alt="Album Cover" className="track-image" />
            <p>{track.track.name}</p>
            <p>{track.track.artists[0]?.name}</p>
            <button onClick={() => playTrack(track.track.uri)}>Play</button> {/* Play specific track */}
          </div>
        ))}
      </div>
      {audioFeatures.length > 0 && (
        <div className="track-features">
          <h2>Track Audio Features</h2>
          {audioFeatures.map((feature) => (
            <div key={feature.id} className="feature-item">
              <p>Danceability: {feature.danceability}</p>
              <p>Energy: {feature.energy}</p>
              <p>Tempo: {feature.tempo}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Tracks;
