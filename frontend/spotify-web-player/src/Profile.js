import React, { useState, useEffect } from 'react';

function Profile({ token }) {
  const [profile, setProfile] = useState(null); // Store Spotify profile data

  useEffect(() => {
    async function fetchProfile() {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${token}` }, // Use token in request
      });
      const data = await response.json(); // Parse the response
      setProfile(data); // Set profile data
    }

    fetchProfile(); // Fetch profile on mount
  }, [token]); // Rerun when token changes

  return (
    <div className="profile-container">
      {profile ? ( /* If profile data is available */
        <div>
          <h1>{profile.display_name}</h1> {/* Display user name */}
          <img src={profile.images[0]?.url} alt="Profile" /> {/* Profile image */}
          <p>Email: {profile.email}</p> {/* Email */}
          <p>Followers: {profile.followers.total}</p> {/* Followers */}
        </div>
      ) : (
        <p>Loading profile...</p> /* Loading state */
      )}
    </div>
  );
}

export default Profile;
