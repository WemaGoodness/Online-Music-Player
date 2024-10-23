import React from 'react';
import './styles/App.css';
import spotifyLogo from './images/Spotify_Full_Logo_RGB_White.png';

function Login() {
  return (
    <div className="login-container">
      <header className="login-header">
        <img src={spotifyLogo} alt="Spotify Logo" className="spotify-logo" />
        <a className="btn-spotify" href="/auth/login">
          Login with Spotify
        </a>
      </header>
    </div>
  );
}

export default Login;
