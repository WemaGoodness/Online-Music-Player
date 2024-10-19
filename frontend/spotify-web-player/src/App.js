import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // For routing
import Sidebar from './Sidebar'; // Sidebar component for navigation
import WebPlayback from './WebPlayback'; // Music player component
import Login from './Login'; // Login page component
import Profile from './Profile'; // Profile component
import Playlists from './Playlists'; // Playlists component
import Search from './Search'; // Search component
import './App.css'; // Import CSS styles
import './Sidebar.css';
import './Search.css';

function App() {
  const [token, setToken] = useState(''); // State to store the Spotify access token

  // Fetch the token when the component mounts
  useEffect(() => {
    async function getToken() {
      const response = await fetch('/auth/token'); // Fetch token from server
      const json = await response.json(); // Parse token response
      setToken(json.access_token); // Set token in state
    }

    getToken(); // Call the getToken function
  }, []); // Empty array ensures this only runs once

  return (
    <Router> {/* React Router for handling page navigation */}
      {token === '' ? ( /* If there's no token, show the login page */
        <Login /> /* Render the Login page component */
      ) : (
        <div className="app-container">
          {/* Sidebar should always be visible after logging in */}
          <Sidebar />

          {/* The content container where different routes will be rendered */}
          <div className="content-container">
            <Routes>
              {/* Define routes for different features/pages */}
              <Route path="/" element={<WebPlayback token={token} />} /> {/* Now Playing */}
              <Route path="/profile" element={<Profile token={token} />} /> {/* Profile page */}
              <Route path="/playlists" element={<Playlists token={token} />} /> {/* Playlists page */}
              <Route path="/search" element={<Search token={token} />} /> {/* Search page */}
            </Routes>
          </div>
        </div>
      )}
    </Router>
  );
}

export default App;
