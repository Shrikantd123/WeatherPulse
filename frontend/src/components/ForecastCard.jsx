function ForecastCard({ day, temp, icon, description, unit }) {
  const tempDisplay = unit === 'C' ? temp : (temp * 9) / 5 + 32;
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  const today = new Date();
  const forecastDate = new Date(today);
  forecastDate.setDate(today.getDate() + day);
  const dayName = day === 0 ? 'Today' : forecastDate.toLocaleDateString('en-US', { weekday: 'short' });
  const dateStr = forecastDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="forecast-card">
      <span className="forecast-day">{dayName}</span>
      <span className="forecast-date">{dateStr}</span>
      <img className="forecast-icon" src={iconUrl} alt={description} />
      <span className="forecast-temp">{Math.round(tempDisplay)}°</span>
      <span className="forecast-desc">{description}</span>
    </div>
  );
}

export default ForecastCard;
