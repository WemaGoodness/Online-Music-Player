// Import React and required hooks
import React, { useState, useEffect } from 'react';

// WebPlayback component to manage Spotify Web Playback SDK
function WebPlayback({ token }) {
  const [player, setPlayer] = useState(undefined); // State for the Spotify player
  const [isPaused, setPaused] = useState(false); // State to track whether playback is paused
  const [currentTrack, setTrack] = useState({
    name: '',
    album: { images: [{ url: '' }] },
    artists: [{ name: '' }],
  });

  // Initialize the Web Playback SDK when component mounts
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Spotify Web Player',
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
        setTrack(state.track_window.current_track); // Set the current track in state
        setPaused(state.paused); // Set the paused state
      });

      player.connect();
    };
  }, [token]); // Dependency array to reinitialize when token changes

  return (
    <div className="container">
      <div className="main-wrapper">
        <img src={currentTrack.album.images[0].url} className="now-playing__cover" alt="Album Cover" />
        <div className="now-playing__side">
          <div className="now-playing__name">{currentTrack.name}</div>
          <div className="now-playing__artist">{currentTrack.artists[0].name}</div>
        </div>
      </div>
      <div className="controls">
        <button onClick={() => player.previousTrack()}>&lt;&lt;</button>
        <button onClick={() => player.togglePlay()}>{isPaused ? 'PLAY' : 'PAUSE'}</button>
        <button onClick={() => player.nextTrack()}>&gt;&gt;</button>
      </div>
    </div>
  );
}

export default WebPlayback;
