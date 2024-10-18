// Import React
import React from 'react';

// Login component with Spotify login button
function Login() {
  return (
    <div className="App">
      <header className="App-header">
        <a className="btn-spotify" href="/auth/login">
          Login with Spotify
        </a>
      </header>
    </div>
  );
}

export default Login;
