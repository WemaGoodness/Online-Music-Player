import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMusic, faSearch, faHome, faCompactDisc, faGuitar, faHeadphones } from '@fortawesome/free-solid-svg-icons';
import './styles/Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/profile">
            <FontAwesomeIcon icon={faUser} /> Profile
          </Link>
        </li>
        <li>
          <Link to="/playlists">
            <FontAwesomeIcon icon={faMusic} /> Playlists
          </Link>
        </li>
        <li>
          <Link to="/albums">
            <FontAwesomeIcon icon={faCompactDisc} /> Albums
          </Link>
        </li>
        <li>
          <Link to="/artists">
            <FontAwesomeIcon icon={faGuitar} /> Artists
          </Link>
        </li>
        <li>
          <Link to="/tracks">
            <FontAwesomeIcon icon={faHeadphones} /> Tracks
          </Link>
        </li>
        <li>
          <Link to="/search">
            <FontAwesomeIcon icon={faSearch} /> Search
          </Link>
        </li>
        <li>
          <Link to="/">
            <FontAwesomeIcon icon={faHome} /> Home
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
