import React from 'react';

const WeatherCard = ({ weatherData, onShare }) => {
  const { city, country, temperature, description, icon, category } = weatherData;

  const isExtremeTemp = temperature >= 35 || temperature <= -15;

  return (
    <div className="weather-card">
      <div className="weather-header">
        <h2>{city}, {country}</h2>
        <button
          className="share-button"
          onClick={onShare}
        >
          📤 Share
        </button>
      </div>

      <div className="weather-main">
        <div 
          className={`temperature ${isExtremeTemp ? 'extreme-temp' : ''}`}
        >
          <span className="temp-value">{temperature}°C</span>
          <span className="temp-icon">🌡️</span>
        </div>

        <div className="weather-info">
          <img 
            src={icon} 
            alt={description}
            className="weather-icon"
          />
          <p className="weather-description">
            {description.charAt(0).toUpperCase() + description.slice(1)}
          </p>
        </div>
      </div>

      <div className={`weather-category category-${category}`}>
        {category === 'hot' && '🔥 Hot'}
        {category === 'cold' && '❄️ Cold'}
        {category === 'rain' && '🌧️ Rainy'}
        {category === 'normal' && '😌 Normal'}
      </div>
    </div>
  );
};

export default WeatherCard;