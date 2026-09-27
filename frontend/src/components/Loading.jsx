function Loading() {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring spinner-ring-inner"></div>
      </div>
      <p className="loading-text">Fetching weather data...</p>
    </div>
  );
}

export default Loading;
