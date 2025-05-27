import React, { useEffect } from 'react';
import { AlertCircle, X, RefreshCw } from 'lucide-react';
// import { useWeather } from '../context/WeatherContext';
import { useWeather } from '../context/wheathercontext';
import styles from '../styles/App.module.css';

const ErrorMessage = () => {
  // Get error state and functions from Context API
  const { error, clearError, refreshWeather, city } = useWeather();

  // Auto-dismiss error after 10 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // Don't render if no error
  if (!error) return null;

  // Determine error type for appropriate styling and messaging
  const getErrorType = (errorMessage) => {
    if (errorMessage.includes('not found') || errorMessage.includes('City not found')) {
      return 'warning';
    }
    if (errorMessage.includes('Network') || errorMessage.includes('connection')) {
      return 'network';
    }
    if (errorMessage.includes('API key') || errorMessage.includes('Invalid')) {
      return 'auth';
    }
    if (errorMessage.includes('Too many requests')) {
      return 'rateLimit';
    }
    return 'general';
  };

  const errorType = getErrorType(error);

  // Get appropriate error icon based on type
  const getErrorIcon = () => {
    switch (errorType) {
      case 'network':
        return <RefreshCw size={20} className={styles.errorIcon} />;
      case 'warning':
        return <AlertCircle size={20} className={styles.errorIconWarning} />;
      default:
        return <AlertCircle size={20} className={styles.errorIcon} />;
    }
  };

  // Get error title based on type
  const getErrorTitle = () => {
    switch (errorType) {
      case 'warning':
        return 'City Not Found';
      case 'network':
        return 'Connection Error';
      case 'auth':
        return 'Authentication Error';
      case 'rateLimit':
        return 'Rate Limit Exceeded';
      default:
        return 'Error';
    }
  };

  // Get helpful suggestion based on error type
  const getErrorSuggestion = () => {
    switch (errorType) {
      case 'warning':
        return 'Please check the city name spelling and try again.';
      case 'network':
        return 'Please check your internet connection and try again.';
      case 'auth':
        return 'There\'s an issue with the API configuration. Please try again later.';
      case 'rateLimit':
        return 'Please wait a moment before making another request.';
      default:
        return 'Please try again later. If the problem persists, try refreshing the page.';
    }
  };

  // Handle retry action
  const handleRetry = () => {
    clearError();
    if (city && errorType !== 'rateLimit') {
      refreshWeather();
    }
  };

  return (
    <div 
      className={`${styles.errorContainer} ${styles[errorType]}`}
      role="alert"
      aria-live="polite"
    >
      <div className={styles.errorContent}>
        {/* Error Header with Icon and Text */}
        <div className={styles.errorHeader}>
          {getErrorIcon()}
          <div className={styles.errorTextContent}>
            <h4 className={styles.errorTitle}>
              {getErrorTitle()}
            </h4>
            <p className={styles.errorMessage}>
              {error}
            </p>
            <p className={styles.errorSuggestion}>
              {getErrorSuggestion()}
            </p>
          </div>
        </div>
        
        {/* Error Actions */}
        <div className={styles.errorActions}>
          {/* Retry Button (only show if we have a city and it's not rate limited) */}
          {city && errorType !== 'rateLimit' && (
            <button 
              onClick={handleRetry}
              className={styles.errorRetryButton}
              title="Retry last search"
              aria-label="Retry weather search"
            >
              <RefreshCw size={16} />
              Retry
            </button>
          )}
          
          {/* Close Button */}
          <button 
            onClick={clearError}
            className={styles.errorCloseButton}
            title="Dismiss error"
            aria-label="Close error message"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      
      {/* Auto-dismiss Progress Bar */}
      <div className={styles.errorProgress}>
        <div className={styles.errorProgressBar}></div>
      </div>
    </div>
  );
};

export default ErrorMessage;