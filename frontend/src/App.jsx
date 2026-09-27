import { useState, useEffect, useCallback } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import ForecastSection from './components/ForecastSection';
import Loading from './components/Loading';
import ErrorMessage from './components/ErrorMessage';
import {
  fetchCurrentWeather,
  fetchForecast,
  fetchWeatherByCoords,
  fetchForecastByCoords,
} from './services/weatherApi';

const SEARCH_HISTORY_KEY = 'weather_search_history';
const MAX_HISTORY = 8;

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('weather_dark_mode');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [unit, setUnit] = useState('C');
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(SEARCH_HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('weather_dark_mode', JSON.stringify(darkMode));
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchHistory));
  }, [searchHistory]);

  useEffect(() => {
    detectLocation();
  }, []);

  const addToHistory = useCallback((city) => {
    setSearchHistory((prev) => {
      const filtered = prev.filter((c) => c.toLowerCase() !== city.toLowerCase());
      return [city, ...filtered].slice(0, MAX_HISTORY);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  }, []);

  const handleSearch = useCallback(
    async (city) => {
      setLoading(true);
      setError(null);
      try {
        const [weatherData, forecastData] = await Promise.all([
          fetchCurrentWeather(city),
          fetchForecast(city),
        ]);
        setWeather(weatherData);
        setForecast(forecastData);
        addToHistory(city);
      } catch (err) {
        const backendMsg = err.response?.data?.error;
        if (err.response?.status === 404) {
          setError(`City "${city}" not found. Please check the spelling and try again.`);
        } else if (err.response?.status === 401 || backendMsg === 'Invalid API key') {
          setError('Invalid API key. Add your OpenWeatherMap API key to backend/.env as WEATHER_API_KEY=your_key and restart the server.');
        } else if (backendMsg === 'WEATHER_API_KEY not configured on server') {
          setError('Backend API key is missing. Create backend/.env with WEATHER_API_KEY=your_key and restart the server.');
        } else if (err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED') {
          setError('Cannot reach the backend server. Make sure it\'s running on http://localhost:5000.');
        } else {
          setError(backendMsg || 'Failed to fetch weather data. Please try again later.');
        }
        setWeather(null);
        setForecast(null);
      } finally {
        setLoading(false);
      }
    },
    [addToHistory]
  );

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const [weatherData, forecastData] = await Promise.all([
            fetchWeatherByCoords(latitude, longitude),
            fetchForecastByCoords(latitude, longitude),
          ]);
          setWeather(weatherData);
          setForecast(forecastData);
        } catch (err) {
          const backendMsg = err.response?.data?.error;
          if (backendMsg === 'WEATHER_API_KEY not configured on server') {
            setError('Backend API key is missing. Create backend/.env with WEATHER_API_KEY=your_key and restart the server.');
          } else if (backendMsg === 'Invalid API key') {
            setError('Invalid API key. Add your OpenWeatherMap API key to backend/.env as WEATHER_API_KEY=your_key and restart the server.');
          } else if (err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED') {
            setError('Cannot reach the backend server. Make sure it\'s running on http://localhost:5000.');
          } else {
            setError(backendMsg || 'Failed to fetch weather data for your location.');
          }
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError(
          'Could not detect your location. Please allow location access or search for a city manually.'
        );
        setLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  }, []);

  const toggleUnit = useCallback(() => {
    setUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  }, []);

  const dismissError = useCallback(() => setError(null), []);

  const getWeatherBgClass = () => {
    if (!weather) return 'bg-default';
    const id = weather.weather[0].id;
    if (id >= 200 && id < 300) return 'bg-thunderstorm';
    if (id >= 300 && id < 600) return 'bg-rain';
    if (id >= 600 && id < 700) return 'bg-snow';
    if (id >= 801 && id <= 804) return 'bg-clouds';
    return 'bg-clear';
  };

  return (
    <div className={`app ${getWeatherBgClass()}`}>
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <svg className="app-logo" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
          </svg>
          <h1 className="app-title">WeatherNow</h1>
        </div>
        <button
          className="btn btn-mode-toggle"
          onClick={() => setDarkMode((prev) => !prev)}
          title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </header>

      <main className="app-main">
        <SearchBar
          onSearch={handleSearch}
          onLocationDetect={detectLocation}
          loading={loading}
        />

        <ErrorMessage message={error} onDismiss={dismissError} />

        {loading && <Loading />}

        {!loading && weather && (
          <>
            <WeatherCard
              weather={weather}
              unit={unit}
              onUnitToggle={toggleUnit}
            />
            <ForecastSection forecast={forecast} unit={unit} />
          </>
        )}

        {!loading && !weather && !error && (
          <div className="welcome">
            <svg className="welcome-icon" viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
              <path d="M12 2v2M4.22 4.22l1.41 1.41M2 12h2M4.22 19.78l1.41-1.41M22 12h-2M18.36 5.64l-1.41 1.41M8 5.4a5 5 0 0 1 8 0" />
            </svg>
            <h2>Welcome to WeatherNow</h2>
            <p>Search for a city or use your current location to get started.</p>
          </div>
        )}

        {/* Search History */}
        {searchHistory.length > 0 && (
          <div className="search-history">
            <div className="history-header">
              <h3 className="section-title">Recent Searches</h3>
              <button className="btn btn-clear-history" onClick={clearHistory}>
                Clear All
              </button>
            </div>
            <div className="history-chips">
              {searchHistory.map((city) => (
                <button
                  key={city}
                  className="history-chip"
                  onClick={() => handleSearch(city)}
                  disabled={loading}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Powered by OpenWeatherMap &bull; Data updates every 3 hours</p>
      </footer>
    </div>
  );
}

export default App;
