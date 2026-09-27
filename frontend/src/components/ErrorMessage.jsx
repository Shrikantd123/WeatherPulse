function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="error-message">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
      <span className="error-text">{message}</span>
      {onDismiss && (
        <button className="btn btn-dismiss" onClick={onDismiss} aria-label="Dismiss error">
          &times;
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
