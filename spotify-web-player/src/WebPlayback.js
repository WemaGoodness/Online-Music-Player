import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faForward, faBackward, faVolumeDown, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import './styles/WebPlayback.css';

// Default track information when no track is playing
const defaultTrack = {
  name: '',
  album: { images: [{ url: '' }] },
  artists: [{ name: '' }],
  duration_ms: 0,
};

function WebPlayback({ token, playTrackProp }) {
  const [player, setPlayer] = useState(undefined); // Spotify player instance
  const [currentTrack, setTrack] = useState(defaultTrack); // Current track details
  const [currentTrackProgress, setTrackProgress] = useState(0); // Track progress in ms
  const [isPaused, setPaused] = useState(false); // Play/Pause state
  const [volume, setVolume] = useState(50); // Volume level (0-100)

  // Format milliseconds to mm:ss format
  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  // Initialize Spotify Web SDK
  useEffect(() => {
    if (!token) return;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    // Load player instance
    window.onSpotifyWebPlaybackSDKReady = () => {
      const playerInstance = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5, // Default volume set to 50%
      });

      setPlayer(playerInstance);

      playerInstance.addListener('ready', ({ device_id }) => {
        console.log('Player is ready with Device ID', device_id);
      });

      playerInstance.addListener('not_ready', ({ device_id }) => {
        console.error('Device has gone offline', device_id);
      });

      // Listen for track and playback state changes
      playerInstance.addListener('player_state_changed', (state) => {
        if (!state) return;
        setTrack(state.track_window.current_track); // Update current track
        setTrackProgress(state.position); // Update track progress
        setPaused(state.paused); // Update paused/playing state
      });

      playerInstance.connect();
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [token]);

  // Update track progress every second if playing
  useEffect(() => {
    let interval;
    if (!isPaused) {
      interval = setInterval(() => {
        setTrackProgress((prev) => {
          if (prev + 1000 < currentTrack.duration_ms) return prev + 1000;
          clearInterval(interval);
          return currentTrack.duration_ms;
        });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPaused, currentTrack]);

  // Seek track position
  const seekToPosition = (positionMs) => {
    fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${positionMs}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(err => console.error('Error seeking track:', err));
    setTrackProgress(positionMs);
  };

  // Adjust volume
  const adjustVolume = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (player) {
      player.setVolume(newVolume / 100).catch(err => console.error('Error setting volume:', err));
    }
  };

  // Toggle play/pause
  const handleTogglePlay = () => {
    if (player) {
      player.togglePlay().catch(err => console.error('Error toggling play:', err));
    }
  };

  // Skip to next track
  const handleNextTrack = () => {
    if (player) {
      player.nextTrack().catch(err => console.error('Error skipping track:', err));
    }
  };

  // Go to previous track
  const handlePreviousTrack = () => {
    if (player) {
      player.previousTrack().catch(err => console.error('Error going to previous track:', err));
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
          <button onClick={handlePreviousTrack}>
            <FontAwesomeIcon icon={faBackward} />
          </button>
          <button onClick={handleTogglePlay}>
            {isPaused ? <FontAwesomeIcon icon={faPlay} /> : <FontAwesomeIcon icon={faPause} />}
          </button>
          <button onClick={handleNextTrack}>
            <FontAwesomeIcon icon={faForward} />
          </button>
        </div>

        <div className="control-sliders">
          {/* Seek Control - Shows track progress */}
          <div className="seek-control">
            <span>{formatTime(currentTrackProgress)}</span>
            <input
              type="range"
              min="0"
              max={currentTrack.duration_ms}
              value={currentTrackProgress}
              onChange={(e) => seekToPosition(e.target.value)}
            />
            <span>{formatTime(currentTrack.duration_ms)}</span>
          </div>

          {/* Volume Control - Adjusts volume level */}
          <div className="volume-control">
            <FontAwesomeIcon icon={faVolumeDown} />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={adjustVolume}
            />
            <FontAwesomeIcon icon={faVolumeUp} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default WebPlayback;
