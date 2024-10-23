import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faForward, faBackward } from '@fortawesome/free-solid-svg-icons';
import './styles/WebPlayback.css'; // Import the WebPlayback specific styles

const defaultTrack = {
  name: '',
  album: { images: [{ url: '' }] },
  artists: [{ name: '' }],
  duration_ms: 0,
};

function WebPlayback({ token }) {
  const [player, setPlayer] = useState(undefined); // Store the player instance
  const [currentTrack, setTrack] = useState(defaultTrack); // Current track details
  const [currentTrackProgress, setTrackProgress] = useState(0); // Track progress
  const [isPaused, setPaused] = useState(false); // Paused or playing state
  const [volume, setVolume] = useState(50); // Volume state

  // Add the useEffect hook to load the SDK and initialize the player
  useEffect(() => {
    if (!token) return; // Exit if token is not provided

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const playerInstance = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: cb => { cb(token); }, // Pass OAuth token
        volume: 0.5, // Set initial volume to 50%
      });

      setPlayer(playerInstance); // Store the player instance in state

      // Add event listeners to handle player readiness and state changes
      playerInstance.addListener('ready', ({ device_id }) => {
        console.log('Player is ready with Device ID', device_id);
      });

      playerInstance.addListener('not_ready', ({ device_id }) => {
        console.error('Device has gone offline', device_id);
      });

      playerInstance.addListener('player_state_changed', (state) => {
        if (!state) return;
        setTrack(state.track_window.current_track); // Update current track
        setTrackProgress(state.position); // Update track progress
        setPaused(state.paused); // Update paused/playing state
      });

      // Connect the player to Spotify
      playerInstance.connect();
    };

    // Cleanup the script on component unmount
    return () => {
      document.body.removeChild(script);
    };
  }, [token]);

  // Function to seek the current track to a specific position
  const seekToPosition = (positionMs) => {
    if (player) {
      fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${positionMs}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      }).then((response) => {
        if (response.status === 204) {
          console.log(`Seeked to ${positionMs}ms`);
        }
      }).catch(err => console.error('Error seeking track:', err));
    }
  };

  // Adjust the player's volume
  const adjustVolume = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume); // Update volume state
    if (player) {
      player.setVolume(newVolume / 100).catch(err => console.error('Error setting volume:', err));
    }
  };

  // Control playback (play/pause)
  const handleTogglePlay = () => {
    if (player) {
      player.togglePlay().catch(err => console.error('Error toggling play:', err));
    }
  };

  const handleNextTrack = () => {
    if (player) {
      player.nextTrack().catch(err => console.error('Error skipping track:', err));
    }
  };

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
