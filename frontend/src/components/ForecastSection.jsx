import ForecastCard from './ForecastCard';

function processForecast(data) {
  const today = new Date().setHours(0, 0, 0, 0);
  const dailyMap = {};

  data.list.forEach((item) => {
    const itemDate = new Date(item.dt * 1000).setHours(0, 0, 0, 0);
    const dayIndex = Math.round((itemDate - today) / (1000 * 60 * 60 * 24));

    if (dayIndex >= 0 && dayIndex <= 5) {
      if (!dailyMap[dayIndex]) {
        dailyMap[dayIndex] = {
          temps: [],
          icons: [],
          descriptions: [],
          iconCounts: {},
        };
      }
      dailyMap[dayIndex].temps.push(item.main.temp);
      dailyMap[dayIndex].icons.push(item.weather[0].icon);
      dailyMap[dayIndex].descriptions.push(item.weather[0].description);

      const icon = item.weather[0].icon;
      dailyMap[dayIndex].iconCounts[icon] = (dailyMap[dayIndex].iconCounts[icon] || 0) + 1;
    }
  });

  return Object.entries(dailyMap)
    .map(([dayIndex, data]) => {
      const avgTemp = data.temps.reduce((a, b) => a + b, 0) / data.temps.length;
      const bestIcon = Object.entries(data.iconCounts).sort((a, b) => b[1] - a[1])[0][0];
      const descIndex = data.icons.indexOf(bestIcon);
      const description = data.descriptions[descIndex] || data.descriptions[0];

      return {
        day: parseInt(dayIndex),
        temp: avgTemp,
        icon: bestIcon,
        description,
      };
    })
    .filter((d) => d.day > 0) 
    .slice(0, 5);
}

function ForecastSection({ forecast, unit }) {
  if (!forecast) return null;

  const dailyForecast = processForecast(forecast);

  return (
    <div className="forecast-section">
      <h3 className="section-title">5-Day Forecast</h3>
      <div className="forecast-grid">
        {dailyForecast.map((day) => (
          <ForecastCard
            key={day.day}
            day={day.day}
            temp={day.temp}
            icon={day.icon}
            description={day.description}
            unit={unit}
          />
        ))}
      </div>
    </div>
  );
}

export default ForecastSection;
