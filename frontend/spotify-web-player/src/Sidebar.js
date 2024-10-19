import React from 'react';
import { Link } from 'react-router-dom'; // Link component for navigation
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMusic, faSearch, faList } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/profile">
            <FontAwesomeIcon icon={faUser} /> Profile {/* Link to Profile page */}
          </Link>
        </li>
        <li>
          <Link to="/playlists">
            <FontAwesomeIcon icon={faMusic} /> Playlists {/* Link to Playlists page */}
          </Link>
        </li>
        <li>
          <Link to="/search">
            <FontAwesomeIcon icon={faSearch} /> Search {/* Link to Search page */}
          </Link>
        </li>
        <li>
          <Link to="/">
            <FontAwesomeIcon icon={faList} /> Now Playing {/* Link to WebPlayback page */}
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
