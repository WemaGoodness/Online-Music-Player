import React, { useState } from 'react';
import './styles/Search.css';

function Search({ token }) {
  const [query, setQuery] = useState(''); // User search query
  const [type, setType] = useState('track'); // Type of search (track, artist, album)
  const [results, setResults] = useState([]); // Store search results
  const [error, setError] = useState(null); // State to store error messages

  // Updated function to search Spotify API with graceful error handling
  const searchSpotify = async () => {
    setError(null); // Reset error state before making a new request
    try {
      const response = await fetch(`/api/search?q=${query}&type=${type}`, {
        headers: { Authorization: `Bearer ${token}` }, // Send access token in headers
      });
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      const data = await response.json();
      setResults(data[type + 's']?.items || []); // Handle undefined cases
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError(error.message); // Set error message to state
    }
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

      {error && <div className="error-message">{error}</div>} {/* Display error message if exists */}

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
