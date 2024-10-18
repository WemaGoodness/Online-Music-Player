// Import React and required hooks
import React, { useState, useEffect } from 'react';
import WebPlayback from './WebPlayback'; // Import WebPlayback component
import Login from './Login'; // Import Login component
import './App.css'; // Import CSS styles

// Main App component
function App() {
  const [token, setToken] = useState(''); // State to store the token
  const [loading, setLoading] = useState(true); // Loading state to prevent flicker

  // Check localStorage for token when the component mounts
  useEffect(() => {
    const storedToken = localStorage.getItem('spotify-token'); // Retrieve token from localStorage
    if (storedToken) {
      setToken(storedToken); // Set token if found in localStorage
    } else {
      const tokenFromUrl = new URLSearchParams(window.location .search).get('token'); // Check for token in URL query parameter
      if (tokenFromUrl) {
        setToken(tokenFromUrl); // Set token if found in URL query parameter
        localStorage.setItem('spotify-token', tokenFromUrl); // Store token in localStorage
      }
    }
    setLoading(false); // Turn off loading once token is checked
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while checking for token
  }

  // Render WebPlayback or Login based on the presence of the token
  return (
    <>
      {token ? <WebPlayback token={token} /> : <Login />} {/* Render WebPlayback if token exists */}
    </>
  );
}

export default App;
