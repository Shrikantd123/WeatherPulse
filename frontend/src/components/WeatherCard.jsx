function WeatherCard({ weather, unit, onUnitToggle }) {
  if (!weather) return null;

  const {
    name,
    sys: { country },
    main: { temp, feels_like, humidity, pressure },
    wind: { speed },
    weather: [weatherInfo],
    visibility,
  } = weather;

  const iconUrl = `https://openweathermap.org/img/wn/${weatherInfo.icon}@4x.png`;
  const tempDisplay = unit === 'C' ? temp : (temp * 9) / 5 + 32;
  const feelsDisplay = unit === 'C' ? feels_like : (feels_like * 9) / 5 + 32;

  return (
    <div className="weather-card">
      <div className="weather-header">
        <div className="weather-location">
          <h2 className="city-name">
            {name}, <span className="country">{country}</span>
          </h2>
          <p className="weather-condition">{weatherInfo.description}</p>
        </div>
        <button className="btn btn-unit-toggle" onClick={onUnitToggle} title="Toggle temperature unit">
          °{unit === 'C' ? 'F' : 'C'}
        </button>
      </div>

      <div className="weather-main">
        <div className="weather-temp-section">
          <img
            className="weather-icon-main"
            src={iconUrl}
            alt={weatherInfo.description}
          />
          <div className="temp-value">{Math.round(tempDisplay)}°</div>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
          </svg>
          <div className="detail-info">
            <span className="detail-label">Feels Like</span>
            <span className="detail-value">{Math.round(feelsDisplay)}°{unit}</span>
          </div>
        </div>
        <div className="detail-item">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>
          <div className="detail-info">
            <span className="detail-label">Humidity</span>
            <span className="detail-value">{humidity}%</span>
          </div>
        </div>
        <div className="detail-item">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
          </svg>
          <div className="detail-info">
            <span className="detail-label">Wind</span>
            <span className="detail-value">{speed} m/s</span>
          </div>
        </div>
        <div className="detail-item">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <path d="M9 9h.01M15 9h.01M9 15h6" />
          </svg>
          <div className="detail-info">
            <span className="detail-label">Pressure</span>
            <span className="detail-value">{pressure} hPa</span>
          </div>
        </div>
        <div className="detail-item">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <div className="detail-info">
            <span className="detail-label">Visibility</span>
            <span className="detail-value">{(visibility / 1000).toFixed(1)} km</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;
