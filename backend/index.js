const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

function buildApiParams(city, lat, lon) {
  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) return null;
  const params = { appid: apiKey, units: 'metric' };
  if (city) params.q = city;
  else if (lat && lon) { params.lat = lat; params.lon = lon; }
  else return null;
  return params;
}

const API_TIMEOUT = 10000;

app.get('/api/weather', async (req, res) => {
  try {
    const { city, lat, lon } = req.query;
    const params = buildApiParams(city, lat, lon);
    if (!params) {
      const msg = !process.env.WEATHER_API_KEY
        ? 'WEATHER_API_KEY not configured on server'
        : 'Provide city, or lat and lon';
      return res.status(400).json({ error: msg });
    }
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', { params, timeout: API_TIMEOUT });
    res.json(response.data);
  } catch (err) {
    if (err.response?.status === 404) return res.status(404).json({ error: 'City not found' });
    if (err.response?.status === 401) return res.status(401).json({ error: 'Invalid API key' });
    console.error('Weather API error:', err.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

app.get('/api/forecast', async (req, res) => {
  try {
    const { city, lat, lon } = req.query;
    const params = buildApiParams(city, lat, lon);
    if (!params) {
      const msg = !process.env.WEATHER_API_KEY
        ? 'WEATHER_API_KEY not configured on server'
        : 'Provide city, or lat and lon';
      return res.status(400).json({ error: msg });
    }
    const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', { params, timeout: API_TIMEOUT });
    res.json(response.data);
  } catch (err) {
    if (err.response?.status === 404) return res.status(404).json({ error: 'City not found' });
    if (err.response?.status === 401) return res.status(401).json({ error: 'Invalid API key' });
    console.error('Forecast API error:', err.message);
    res.status(500).json({ error: 'Failed to fetch forecast data' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
