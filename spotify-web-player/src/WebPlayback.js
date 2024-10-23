import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faForward, faBackward } from '@fortawesome/free-solid-svg-icons';
import './styles/WebPlayback.css'; // Import the WebPlayback specific styles

const defaultTrack = {
  name: '',
  album: { images: [{ url: '' }] },
  artists: [{ name: '' }],
  duration_ms: 0
};

function WebPlayback({ token }) {
  const [player, setPlayer] = useState(undefined);
  const [currentTrack, setTrack] = useState(defaultTrack);
  const [currentTrackProgress, setTrackProgress] = useState(0);
  const [isPaused, setPaused] = useState(false);
  const [volume, setVolume] = useState(50);

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

      player.addListener('player_state_changed', (state) => {
        if (!state) return;
        setTrack(state.track_window.current_track);
        setTrackProgress(state.position);
        setPaused(state.paused);
      });

      player.connect();

      const interval = setInterval(() => {
        player.getCurrentState().then((state) => {
          if (state && !state.paused) {
            setTrackProgress(state.position);
          }
        });
      }, 500); // Update every 0.5 second

      return () => clearInterval(interval);
    };
  }, [token]);

  const seekToPosition = (positionMs) => {
    fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${positionMs}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    }).then(response => {
      if (response.status === 204) {
        console.log(`Seeked to ${positionMs}ms`);
      }
    });
  };

  const adjustVolume = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (player) {
      player.setVolume(newVolume / 100);
    }
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
          <button onClick={() => player.previousTrack()}>
            <FontAwesomeIcon icon={faBackward} />
          </button>
          <button onClick={() => player.togglePlay()}>
            {isPaused ? <FontAwesomeIcon icon={faPlay} /> : <FontAwesomeIcon icon={faPause} />}
          </button>
          <button onClick={() => player.nextTrack()}>
            <FontAwesomeIcon icon={faForward} />
          </button>
        </div>

        <div className="control-sliders">
          <div className="seek-control">
            <input
              type="range"
              min="0"
              max={currentTrack.duration_ms}
              value={currentTrackProgress}
              onChange={(e) => seekToPosition(e.target.value)}
            />
            <span>{Math.floor(currentTrackProgress / 1000)}s</span>
          </div>

          <div className="volume-control">
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={adjustVolume}
            />
            <span>Volume: {volume}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WebPlayback;
