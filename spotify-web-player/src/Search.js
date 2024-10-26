import React, { useState } from 'react';
import './styles/Search.css';

function Search({ token, playTrack }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('track'); // Default to searching tracks
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const searchSpotify = async () => {
    if (!query || !type) return setError('Please enter a search term and select a type.');

    setError(null);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${type}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch search results');
      }

      const data = await response.json();
      setResults(data[type + 's']?.items || []);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError(error.message);
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search for tracks, artists, albums..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="track">Track</option>
        <option value="artist">Artist</option>
        <option value="album">Album</option>
      </select>
      <button onClick={searchSpotify}>Search</button>

      {error && <div className="error-message">{error}</div>}

      <div className="results">
        {results.map((item) => (
          <div key={item.id} className="result-item">
            <img src={item.images?.[0]?.url || item.album?.images[0]?.url} alt={item.name} />
            <p>{item.name}</p>
            {type === 'track' && (
              <button onClick={() => playTrack(item.uri)}>Play</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
