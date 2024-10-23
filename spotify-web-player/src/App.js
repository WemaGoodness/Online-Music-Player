import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar';
import WebPlayback from './WebPlayback';
import Login from './Login';
import Profile from './Profile';
import Playlists from './Playlists';
import Search from './Search';
import Albums from './Albums';
import Artists from './Artists';
import Tracks from './Tracks';
import './styles/App.css'; // Main layout styles
import './styles/Sidebar.css';
import './styles/WebPlayback.css'; // Import WebPlayback styles

function App() {
  const [token, setToken] = useState(''); // State to store the Spotify access token

  useEffect(() => {
    async function getToken() {
      const response = await fetch('/auth/token'); // Fetch token from server
      const json = await response.json(); // Parse token response
      setToken(json.access_token); // Set token in state
    }

    getToken(); // Call the getToken function
  }, []); // Empty array ensures this only runs once

  return (
    <Router>
      {token === '' ? (
        <Login /> // Show login if no token
      ) : (
        <div className="app-container">
          <Sidebar /> {/* Sidebar with links to sections */}
          <div className="content-container">
            <Routes>
              <Route path="/" element={<WebPlayback token={token} />} /> {/* Now Playing */}
              <Route path="/profile" element={<Profile token={token} />} /> {/* Profile */}
              <Route path="/playlists" element={<Playlists token={token} />} /> {/* Playlists */}
              <Route path="/albums" element={<Albums token={token} />} /> {/* Albums */}
              <Route path="/artists" element={<Artists token={token} />} /> {/* Artists */}
              <Route path="/tracks" element={<Tracks token={token} />} /> {/* Tracks */}
              <Route path="/search" element={<Search token={token} />} /> {/* Search */}
            </Routes>
          </div>
          <WebPlayback token={token} /> {/* Player always visible */}
        </div>
      )}
    </Router>
  );
}

export default App;
