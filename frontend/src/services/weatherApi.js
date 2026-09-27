import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_TIMEOUT = 10000;

const api = axios.create({
  timeout: API_TIMEOUT,
});


export const fetchCurrentWeather = async (city) => {
  const response = await api.get(`${API_BASE}/weather`, {
    params: { city },
  });
  return response.data;
};

export const fetchForecast = async (city) => {
  const response = await api.get(`${API_BASE}/forecast`, {
    params: { city },
  });
  return response.data;
};

export const fetchWeatherByCoords = async (lat, lon) => {
  const response = await api.get(`${API_BASE}/weather`, {
    params: { lat, lon },
  });
  return response.data;
};


export const fetchForecastByCoords = async (lat, lon) => {
  const response = await api.get(`${API_BASE}/forecast`, {
    params: { lat, lon },
  });
  return response.data;
};
