const express = require('express');
const cors = require('cors');
const axios = require('axios');
const NodeCache = require('node-cache');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

if (!WEATHER_API_KEY) {
  console.error('WEATHER_API_KEY environment variable is required');
  process.exit(1);
}

// Get base URL for images based on environment
const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.RENDER_EXTERNAL_URL || 'https://your-app-name.onrender.com';
  }
  return 'http://localhost:5000';
};

const BASE_URL = getBaseUrl();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from test/images directory
app.use('/images', express.static(path.join(__dirname, 'test', 'images')));

// Cache for weather data (5 minutes)
const weatherCache = new NodeCache({ stdTTL: 300 });

// Load memes from JSON file
const memesPath = path.join(__dirname, 'test', 'memes.json');
let memes = {};

try {
  const memesData = fs.readFileSync(memesPath, 'utf8');
  memes = JSON.parse(memesData);
  
  // Update image URLs to use current base URL
  Object.keys(memes).forEach(category => {
    memes[category].forEach(meme => {
      if (meme.image && meme.image.startsWith('http://localhost:5000')) {
        meme.image = meme.image.replace('http://localhost:5000', BASE_URL);
      }
    });
  });
} catch (error) {
  console.error('Error loading memes:', error);
  // Default memes structure
  memes = {
    "hot": [
      { "image": `${BASE_URL}/images/1.jpg`, "text": "When it's +30°C outside and you're trying to look fresh" },
      { "image": `${BASE_URL}/images/2.jpg`, "text": "Sand in shorts = new crystals" }
    ],
    "cold": [
      { "image": `${BASE_URL}/images/4.jpg`, "text": "When you turn on the heating and the meter laughs" },
      { "image": `${BASE_URL}/images/1.jpg`, "text": "-20°C: time to become an Eskimo" }
    ],
    "normal": [
      { "image": `${BASE_URL}/images/5.jpg`, "text": "Perfect weather for doing nothing" },
      { "image": `${BASE_URL}/images/3.jpg`, "text": "Weather is weather, life goes on" }
    ],
    "rain": [
      { "image": `${BASE_URL}/images/1.jpg`, "text": "Rain: nature reminds you that you have things to do at home" },
      { "image": `${BASE_URL}/images/2.jpg`, "text": "When they promised rain, but you're still without an umbrella" }
    ]
  };
}

// Helper function to get weather category
function getWeatherCategory(temp, description) {
  if (temp >= 30) return 'hot';
  if (temp <= -10) return 'cold';
  if (description.toLowerCase().includes('rain') || description.toLowerCase().includes('drizzle')) return 'rain';
  return 'normal';
}

// Helper function to get random meme
function getRandomMeme(category) {
  const categoryMemes = memes[category] || memes.normal;
  return categoryMemes[Math.floor(Math.random() * categoryMemes.length)];
}

// GET /weather endpoint
app.get('/weather', async (req, res) => {
  const { city } = req.query;

  console.log(`Weather request for city: ${city}`);
  console.log(`Weather API Key: ${WEATHER_API_KEY ? 'Present' : 'Missing'}`);
  console.log(`Weather API Key length: ${WEATHER_API_KEY ? WEATHER_API_KEY.length : 0}`);

  if (!city) {
    return res.status(400).json({ error: 'City parameter is required' });
  }

  // Check cache first
  const cacheKey = city.toLowerCase();
  const cachedData = weatherCache.get(cacheKey);
  if (cachedData) {
    console.log('Returning cached data for:', city);
    return res.json(cachedData);
  }

  try {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric&lang=en`;
    console.log('Making request to:', weatherUrl);
    
    // Get weather data from OpenWeatherMap
    const weatherResponse = await axios.get(weatherUrl);

    const weatherData = weatherResponse.data;
    const temperature = Math.round(weatherData.main.temp);
    const description = weatherData.weather[0].description;
    const icon = weatherData.weather[0].icon;

    // Get appropriate meme
    const weatherCategory = getWeatherCategory(temperature, description);
    const meme = getRandomMeme(weatherCategory);

    const result = {
      city: weatherData.name,
      country: weatherData.sys.country,
      temperature,
      description,
      icon: `https://openweathermap.org/img/wn/${icon}@2x.png`,
      meme,
      category: weatherCategory
    };

    // Cache the result
    weatherCache.set(cacheKey, result);

    res.json(result);
  } catch (error) {
    console.error('Weather API error details:');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    
    if (error.response?.status === 401) {
      return res.status(500).json({ error: 'Invalid weather API key. Check server settings.' });
    }
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'City not found' });
    }
    res.status(500).json({ error: 'Error getting weather data' });
  }
});

// POST /memes endpoint
app.post('/memes', (req, res) => {
  const { category, image, text } = req.body;

  if (!category || !image || !text) {
    return res.status(400).json({ error: 'Category, image and text are required' });
  }

  if (!memes[category]) {
    memes[category] = [];
  }

  const newMeme = { image, text };
  memes[category].push(newMeme);

  // Save to file
  try {
    fs.writeFileSync(memesPath, JSON.stringify(memes, null, 2));
  } catch (error) {
    console.error('Error saving memes:', error);
    return res.status(500).json({ error: 'Error saving meme' });
  }

  res.json({ message: 'Meme added successfully', meme: newMeme });
});

// GET /memes endpoint (for admin)
app.get('/memes', (req, res) => {
  res.json(memes);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
