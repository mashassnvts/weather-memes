import React, { useState } from 'react';

const SearchForm = ({ onSearch, loading }) => {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <form 
      className="search-form"
      onSubmit={handleSubmit}
    >
      <div className="input-group">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name..."
          className="city-input"
          disabled={loading}
        />
        <button
          type="submit"
          className="search-button"
          disabled={loading || !city.trim()}
        >
          {loading ? (
            <div className="loading-spinner">
              ⏳
            </div>
          ) : (
            '🌤️ Get Weather'
          )}
        </button>
      </div>
    </form>
  );
};

export default SearchForm;