import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import WeatherCard from './components/WeatherCard';
import MemeCard from './components/MemeCard';
import SearchForm from './components/SearchForm';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleWeatherSearch = useCallback(async (city) => {
    setLoading(true);
    setError(null);
    
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/weather?city=${encodeURIComponent(city)}`);
      const data = await response.json();
      
      if (response.ok) {
        setWeatherData(data);
      } else {
        setError(data.error || 'Error getting weather data');
      }
    } catch (err) {
      setError('Server connection error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load city from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const cityFromUrl = urlParams.get('city');
    if (cityFromUrl) {
      handleWeatherSearch(cityFromUrl);
    }
  }, [handleWeatherSearch]);

  const handleShare = () => {
    if (weatherData) {
      const shareUrl = `${window.location.origin}?city=${encodeURIComponent(weatherData.city)}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Link copied to clipboard!');
      });
    }
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>🌤️ Weather & Memes</h1>
          <p>Check the weather in any city and get a mood-appropriate meme!</p>
        </header>

        <SearchForm 
          onSearch={handleWeatherSearch} 
          loading={loading}
        />

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {weatherData && (
          <div className="weather-container">
            <WeatherCard 
              weatherData={weatherData} 
              onShare={handleShare}
            />
            <MemeCard meme={weatherData.meme} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;