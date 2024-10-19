// src/Search.js
import React, { useState } from 'react';
import './Search.css';

function Search({ token }) {
  const [query, setQuery] = useState(''); // User search query
  const [type, setType] = useState('track'); // Type of search (track, artist, album)
  const [results, setResults] = useState([]); // Store search results

  // Function to search Spotify API
  const searchSpotify = async () => {
    const response = await fetch(`/api/search?q=${query}&type=${type}`, {
      headers: { Authorization: `Bearer ${token}` }, // Send access token in headers
    });
    const data = await response.json(); // Parse the response
    setResults(data[type + 's'].items); // Set search results (track/artist/album items)
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search for tracks, artists, albums..."
        value={query}
        onChange={(e) => setQuery(e.target.value)} // Update query state on input change
      />
      <select value={type} onChange={(e) => setType(e.target.value)}> {/* Select search type */}
        <option value="track">Track</option>
        <option value="artist">Artist</option>
        <option value="album">Album</option>
      </select>
      <button onClick={searchSpotify}>Search</button> {/* Trigger search on button click */}

      <div className="results">
        {results.map((item) => (
          <div key={item.id}>
            <img src={item.images?.[0]?.url} alt={item.name} /> {/* Display item image */}
            <p>{item.name}</p> {/* Display item name */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
