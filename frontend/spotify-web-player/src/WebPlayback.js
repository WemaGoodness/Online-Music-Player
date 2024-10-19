import React, { useState, useEffect } from 'react';
import './App.css'; // Ensure your styles are imported

const defaultTrack = {
  name: '',
  album: {
    images: [
      { url: '' }
    ]
  },
  artists: [
    { name: '' }
  ]
};

function WebPlayback({ token }) {
  const [player, setPlayer] = useState(undefined);
  const [currentTrack, setTrack] = useState(defaultTrack);
  const [isPaused, setPaused] = useState(false);
  const [volume, setVolume] = useState(50);
  const [repeatMode, setRepeatMode] = useState('off');

  // Initialize Spotify Player SDK
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: (cb) => { cb(token); },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.addListener('player_state_changed', (state) => {
        if (!state) return;

        setTrack(state.track_window.current_track);
        setPaused(state.paused);
      });

      player.connect();
    };

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [token]);

  // Adjust volume
  const adjustVolume = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (player) {
      player.setVolume(newVolume / 100);
    }
  };

  // Toggle repeat modes
  const toggleRepeatMode = () => {
    const modes = ['off', 'context', 'track'];
    const nextMode = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
    setRepeatMode(nextMode);
    fetch(`https://api.spotify.com/v1/me/player/repeat?state=${nextMode}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  return (
    <div className="player-container">
      <div className="main-wrapper">
        <img src={currentTrack.album.images[0]?.url} alt="Album Cover" className="now-playing__cover" />
        <div className="now-playing__side">
          <div className="now-playing__name">{currentTrack.name}</div>
          <div className="now-playing__artist">{currentTrack.artists[0]?.name}</div>
        </div>

        <div className="controls">
          <button className="btn-spotify" onClick={() => player.previousTrack()}>&lt;&lt;</button>
          <button className="btn-spotify" onClick={() => player.togglePlay()}>{isPaused ? 'PLAY' : 'PAUSE'}</button>
          <button className="btn-spotify" onClick={() => player.nextTrack()}>&gt;&gt;</button>
        </div>

        <div className="volume-control">
          <input type="range" min="0" max="100" value={volume} onChange={adjustVolume} />
          <span>Volume: {volume}%</span>
        </div>

        <div className="repeat-control">
          <button className="btn-spotify" onClick={toggleRepeatMode}>Repeat: {repeatMode.toUpperCase()}</button>
        </div>
      </div>
    </div>
  );
}

export default WebPlayback;
