import React from 'react';
import { AuthProvider,useAuth } from './context/authcontext';

import { WeatherProvider, useWeather  } from './context/wheathercontext';
import SearchInput from './components/searchinput';
import WeatherDisplay from './components/weatherdisplay';
import ErrorMessage from './components/errormessage';

import LoginPage from './components/loginpage';
import { LogOut, User, History } from 'lucide-react';
import styles from './styles/App.module.css';

// User Menu Component
const UserMenu = () => {
  const { user, signOut, getUserDisplayName, weatherHistory } = useAuth();
  const [showDropdown, setShowDropdown] = React.useState(false);

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      console.log('Signed out successfully');
      setShowDropdown(false);
    }
  };

  return (
    <div className={styles.userMenu}>
      <button 
        className={styles.userMenuButton}
        onClick={() => setShowDropdown(!showDropdown)}
        aria-label="User menu"
      >
        <User size={18} />
        <span className={styles.userName}>{getUserDisplayName()}</span>
      </button>
      
      {/* User Dropdown Menu */}
      {showDropdown && (
        <div className={styles.userDropdown}>
          <div className={styles.userDropdownHeader}>
            <User size={16} />
            <div>
              <div className={styles.userDisplayName}>{getUserDisplayName()}</div>
              <div className={styles.userEmail}>{user?.email}</div>
            </div>
          </div>
          
          <div className={styles.userDropdownDivider}></div>
          
          {/* Weather History */}
          {weatherHistory.length > 0 && (
            <>
              <div className={styles.userDropdownSection}>
                <div className={styles.sectionTitle}>
                  <History size={16} />
                  Recent Searches
                </div>
                {weatherHistory.slice(0, 3).map((search, index) => (
                  <div key={index} className={styles.historyItem}>
                    <span className={styles.historyCity}>{search.city}</span>
                    <span className={styles.historyTemp}>{search.temperature}°C</span>
                  </div>
                ))}
              </div>
              <div className={styles.userDropdownDivider}></div>
            </>
          )}
          
          {/* Sign Out */}
          <button 
            onClick={handleSignOut}
            className={styles.signOutButton}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      )}
      
      {/* Overlay to close dropdown */}
      {showDropdown && (
        <div 
          className={styles.dropdownOverlay}
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

// Unit Toggle Component
const UnitToggle = () => {
  const { unit, toggleUnit } = useWeather();
  const { savePreferences, userPreferences } = useAuth();

  const handleToggleUnit = () => {
    toggleUnit();
    // Save preference to Supabase if user is logged in
    savePreferences({
      unit: unit === 'celsius' ? 'fahrenheit' : 'celsius',
      defaultCity: userPreferences?.default_city || ''
    });
  };

  return (
    <button 
      onClick={handleToggleUnit} 
      className={styles.unitToggle}
      title={`Switch to ${unit === 'celsius' ? 'Fahrenheit' : 'Celsius'}`}
      aria-label={`Currently showing ${unit}, click to switch to ${unit === 'celsius' ? 'Fahrenheit' : 'Celsius'}`}
    >
      °{unit === 'celsius' ? 'C' : 'F'}
    </button>
  );
};

// Header Component for Dashboard
const DashboardHeader = () => {
  return (
    <header className={styles.dashboardHeader}>
      <div className={styles.headerContent}>
        <h1 className={styles.appTitle}>Weather Dashboard</h1>
        <p className={styles.appSubtitle}>Real-time weather information</p>
      </div>
      
      <div className={styles.headerActions}>
        <UnitToggle />
        <UserMenu />
      </div>
    </header>
  );
};

// Enhanced Weather Display that saves searches
const EnhancedWeatherDisplay = () => {
  const { weather } = useWeather();
  const { saveWeatherSearch, isAuthenticated } = useAuth();

  // Save weather search when weather data changes
  React.useEffect(() => {
    if (weather && isAuthenticated) {
      saveWeatherSearch(weather);
    }
  }, [weather, isAuthenticated, saveWeatherSearch]);

  return <WeatherDisplay />;
};

// Weather Dashboard Component (only shown after authentication)
const WeatherDashboard = () => {
  return (
    <WeatherProvider>
      <div className={styles.weatherDashboard}>
        <div className={styles.dashboardContainer}>
          {/* Dashboard Header */}
          <DashboardHeader />
          
          {/* Main Content Area */}
          <main className={styles.mainContent} role="main">
            {/* Search Input Component */}
            <SearchInput />
            
            {/* Error Message Component */}  
            <ErrorMessage />
            
            {/* Enhanced Weather Display Component */}
            <EnhancedWeatherDisplay />
          </main>
          
          {/* Dashboard Footer */}
          <footer className={styles.dashboardFooter}>
            <div className={styles.footerContent}>
              <p>Built with React.js • Data updates every 30 seconds</p>
              <p>&copy; 2024 Weather Dashboard • Powered by OpenWeatherMap & Supabase</p>
            </div>
          </footer>
        </div>

        {/* Background Decorative Elements */}
        <div className={styles.backgroundDecoration}>
          <div className={`${styles.decorationCircle} ${styles.circle1}`}></div>
          <div className={`${styles.decorationCircle} ${styles.circle2}`}></div>
          <div className={`${styles.decorationCircle} ${styles.circle3}`}></div>
        </div>
      </div>
    </WeatherProvider>
  );
};

// Loading Screen Component
const LoadingScreen = () => {
  return (
    <div className={styles.loadingScreen}>
      <div className={styles.loadingContent}>
        <div className={styles.loadingSpinner}></div>
        <h2>Loading Weather Dashboard</h2>
        <p>Initializing your personalized weather experience...</p>
      </div>
    </div>
  );
};

// Main App Content with Authentication Flow
const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Show LoginPage if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Show Weather Dashboard if authenticated
  return <WeatherDashboard />;
};

// Error Boundary Component
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

// Main App Component - Authentication Required
const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className={styles.app}>
          <AppContent />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;