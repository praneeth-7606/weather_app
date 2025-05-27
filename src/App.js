import React from 'react';
// import { WeatherProvider, useWeather } from './context/WeatherContext';
import { WeatherProvider,useWeather  } from './context/wheathercontext';
import SearchInput from './components/searchinput';
import WeatherDisplay from './components/weatherdisplay';

import ErrorMessage from './components/errormessage';
import styles from './styles/App.module.css';

// Unit Toggle Component
const UnitToggle = () => {
  const { unit, toggleUnit } = useWeather();

  return (
    <button 
      onClick={toggleUnit} 
      className={styles.unitToggle}
      title={`Switch to ${unit === 'celsius' ? 'Fahrenheit' : 'Celsius'}`}
      aria-label={`Currently showing ${unit}, click to switch to ${unit === 'celsius' ? 'Fahrenheit' : 'Celsius'}`}
    >
      °{unit === 'celsius' ? 'C' : 'F'}
    </button>
  );
};

// Header Component
const AppHeader = () => {
  return (
    <header className={styles.appHeader}>
      <div className={styles.headerContent}>
        <h1 className={styles.appTitle}>Weather Dashboard</h1>
        <p className={styles.appSubtitle}>Real-time weather information</p>
      </div>
      <UnitToggle />
    </header>
  );
};

// Footer Component
const AppFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={styles.appFooter}>
      <div className={styles.footerContent}>
        <p>Built with React.js • Data updates every 30 seconds</p>
        <p>&copy; {currentYear} Weather Dashboard • Powered by OpenWeatherMap</p>
      </div>
    </footer>
  );
};

// Main App Content (inside WeatherProvider)
const AppContent = () => {
  return (
    <div className={styles.appContent}>
      {/* App Header */}
      <AppHeader />
      
      {/* Main Content Area */}
      <main className={styles.mainContent} role="main">
        {/* Search Input Component */}
        <SearchInput />
        
        {/* Error Message Component */}  
        <ErrorMessage />
        
        {/* Weather Display Component */}
        <WeatherDisplay />
      </main>
      
      {/* App Footer */}
      <AppFooter />
    </div>
  );
};

// Error Boundary Component for better error handling
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Weather App Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorBoundary}>
          <div className={styles.errorBoundaryContent}>
            <h2>Something went wrong</h2>
            <p>The weather app encountered an unexpected error.</p>
            <button 
              onClick={() => this.setState({ hasError: false, error: null })}
              className={styles.errorBoundaryRetry}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main App Component
const App = () => {
  return (
    <ErrorBoundary>
      <WeatherProvider>
        <div className={styles.app}>
          <div className={styles.appContainer}>
            <AppContent />
          </div>
          
          {/* Background Decorative Elements */}
          <div className={styles.backgroundDecoration}>
            <div className={`${styles.decorationCircle} ${styles.circle1}`}></div>
            <div className={`${styles.decorationCircle} ${styles.circle2}`}></div>
            <div className={`${styles.decorationCircle} ${styles.circle3}`}></div>
          </div>
        </div>
      </WeatherProvider>
    </ErrorBoundary>
  );
};

export default App;