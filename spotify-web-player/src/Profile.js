import React, { useState, useEffect } from 'react';
import './styles/Profile.css';

function Profile({ token }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (token) {
      fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setProfile(data);
        })
        .catch((error) => console.error('Error fetching profile:', error));
    }
  }, [token]);

  return (
    <div className="profile-container">
      {profile ? (
        <>
          <img src={profile.images[0]?.url} alt="Profile" className="profile-image" />
          <h1>{profile.display_name}</h1>
          <p>{profile.email}</p>
          <p>Followers: {profile.followers.total}</p>
        </>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}

export default Profile;
