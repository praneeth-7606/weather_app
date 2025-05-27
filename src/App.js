

// import React, { useState, useEffect } from 'react';
// import { Search, MapPin, Wind, Droplets, Eye, Thermometer, Sun, Cloud, CloudRain, CloudSnow, Zap, RefreshCw } from 'lucide-react';

// // Weather Icon Component
// const WeatherIcon = ({ condition, size = 64 }) => {
//   const getIcon = () => {
//     switch (condition?.toLowerCase()) {
//       case 'clear':
//       case 'sunny':
//         return <Sun size={size} style={{ color: '#ffd700' }} />;
//       case 'clouds':
//       case 'cloudy':
//         return <Cloud size={size} style={{ color: '#87ceeb' }} />;
//       case 'rain':
//       case 'rainy':
//         return <CloudRain size={size} style={{ color: '#4682b4' }} />;
//       case 'snow':
//       case 'snowy':
//         return <CloudSnow size={size} style={{ color: '#e6e6fa' }} />;
//       case 'thunderstorm':
//       case 'stormy':
//         return <Zap size={size} style={{ color: '#9370db' }} />;
//       default:
//         return <Sun size={size} style={{ color: '#ffd700' }} />;
//     }
//   };

//   return <div>{getIcon()}</div>;
// };

// const WeatherDashboard = () => {
//   const [city, setCity] = useState('');
//   const [weather, setWeather] = useState(null);
//   const [forecast, setForecast] = useState([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [unit, setUnit] = useState('celsius');

//   // API configuration
//   const API_KEY = '32c4c18d9b89fe52222feb587433c873';
//   const BASE_URL = 'https://api.openweathermap.org/data/2.5';

//   // Load last searched city from localStorage
//   useEffect(() => {
//     const lastCity = localStorage.getItem('lastSearchedCity');
//     if (lastCity) {
//       setCity(lastCity);
//       fetchWeather(lastCity);
//     }
//   }, []);

//   // Auto-refresh every 30 seconds
//   useEffect(() => {
//     let interval;
//     if (weather && city) {
//       interval = setInterval(() => {
//         fetchWeather(city);
//       }, 30000);
//     }
//     return () => clearInterval(interval);
//   }, [weather, city]);

//   // Temperature conversion
//   const convertTemp = (temp) => {
//     if (unit === 'fahrenheit') {
//       return Math.round((temp * 9/5) + 32);
//     }
//     return Math.round(temp);
//   };

//   // Fetch weather with CORS handling
//   const fetchWithProxy = async (url) => {
//     try {
//       // Try direct fetch first
//       const response = await fetch(url);
//       if (response.ok) return response;
//       throw new Error('Direct fetch failed');
//     } catch (error) {
//       // Try with CORS proxy
//       const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
//       return await fetch(proxyUrl);
//     }
//   };

//   const fetchWeather = async (cityName = city) => {
//     if (!cityName.trim()) {
//       setError('Please enter a city name.');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       // Fetch current weather
//       const weatherUrl = `${BASE_URL}/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`;
//       console.log('🌐 Fetching weather for:', cityName);
      
//       const weatherResponse = await fetchWithProxy(weatherUrl);
      
//       if (!weatherResponse.ok) {
//         throw new Error(weatherResponse.status === 404 ? 'City not found' : 'Weather service error');
//       }
      
//       const weatherData = await weatherResponse.json();
//       console.log('✅ Weather data received:', weatherData);

//       setWeather(weatherData);
//       setCity(cityName);
//       localStorage.setItem('lastSearchedCity', cityName);

//       // Fetch forecast
//       try {
//         const forecastUrl = `${BASE_URL}/forecast?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`;
//         const forecastResponse = await fetchWithProxy(forecastUrl);
        
//         if (forecastResponse.ok) {
//           const forecastData = await forecastResponse.json();
          
//           // Process forecast - get one per day
//           const dailyForecasts = {};
//           forecastData.list.forEach(item => {
//             const date = new Date(item.dt * 1000);
//             const dayKey = date.toDateString();
//             const hour = date.getHours();
            
//             if (!dailyForecasts[dayKey] || Math.abs(hour - 12) < Math.abs(dailyForecasts[dayKey].hour - 12)) {
//               dailyForecasts[dayKey] = {
//                 day: date.toLocaleDateString('en-US', { weekday: 'short' }),
//                 temp_max: Math.round(item.main.temp_max),
//                 temp_min: Math.round(item.main.temp_min),
//                 condition: item.weather[0].main,
//                 icon: item.weather[0].icon,
//                 hour: hour
//               };
//             }
//           });
          
//           const today = new Date().toDateString();
//           const processedForecast = Object.values(dailyForecasts)
//             .filter(f => f.day !== today)
//             .slice(0, 5);
          
//           setForecast(processedForecast);
//           console.log('✅ Forecast data processed:', processedForecast);
//         }
//       } catch (err) {
//         console.warn('⚠️ Forecast failed:', err.message);
//         setForecast([]);
//       }

//     } catch (err) {
//       console.error('❌ Weather fetch error:', err);
//       setError(err.message || 'Failed to fetch weather data');
//       setWeather(null);
//       setForecast([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = () => {
//     fetchWeather();
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       fetchWeather();
//     }
//   };

//   const toggleUnit = () => {
//     setUnit(unit === 'celsius' ? 'fahrenheit' : 'celsius');
//   };

//   const quickSearch = (cityName) => {
//     setCity(cityName);
//     fetchWeather(cityName);
//   };

//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//       padding: '20px',
//       fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
//     }}>
//       <div style={{ maxWidth: '1200px', margin: '0 auto', color: 'white' }}>
        
//         {/* Header */}
//         <header style={{ 
//           display: 'flex', 
//           justifyContent: 'space-between', 
//           alignItems: 'center', 
//           marginBottom: '2rem' 
//         }}>
//           <div>
//             <h1 style={{ fontSize: '2.5rem', fontWeight: '700', margin: '0 0 0.5rem 0' }}>
//               Weather Dashboard
//             </h1>
//             <p style={{ fontSize: '1.1rem', opacity: '0.8', margin: '0' }}>
//               Real-time weather information
//             </p>
//           </div>
//           <button 
//             onClick={toggleUnit}
//             style={{
//               background: 'rgba(255,255,255,0.2)',
//               border: '2px solid rgba(255,255,255,0.3)',
//               color: 'white',
//               padding: '12px 20px',
//               borderRadius: '50px',
//               fontSize: '1.1rem',
//               fontWeight: '600',
//               cursor: 'pointer',
//               backdropFilter: 'blur(10px)'
//             }}
//           >
//             °{unit === 'celsius' ? 'C' : 'F'}
//           </button>
//         </header>

//         {/* Search */}
//         <div style={{ marginBottom: '2rem' }}>
//           <div style={{
//             display: 'flex',
//             alignItems: 'center',
//             background: 'rgba(255,255,255,0.15)',
//             backdropFilter: 'blur(20px)',
//             border: '2px solid rgba(255,255,255,0.2)',
//             borderRadius: '60px',
//             padding: '8px 12px',
//             gap: '8px'
//           }}>
//             <Search size={20} style={{ color: 'rgba(255,255,255,0.7)', marginLeft: '8px' }} />
//             <input
//               type="text"
//               value={city}
//               onChange={(e) => setCity(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder="Search for a city..."
//               disabled={loading}
//               style={{
//                 flex: 1,
//                 background: 'none',
//                 border: 'none',
//                 padding: '16px 20px',
//                 fontSize: '1.1rem',
//                 color: 'white',
//                 outline: 'none'
//               }}
//             />
//             <button 
//               onClick={handleSearch}
//               disabled={loading || !city.trim()}
//               style={{
//                 background: loading ? 'rgba(255,107,107,0.5)' : 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
//                 border: 'none',
//                 color: 'white',
//                 padding: '14px 28px',
//                 borderRadius: '50px',
//                 fontSize: '1rem',
//                 fontWeight: '600',
//                 cursor: loading ? 'not-allowed' : 'pointer',
//                 opacity: loading ? 0.6 : 1
//               }}
//             >
//               {loading ? 'Searching...' : 'Search'}
//             </button>
//           </div>

//           {/* Quick Search */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
//             <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>Quick search:</span>
//             {['Kollam', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai'].map((cityName) => (
//               <button
//                 key={cityName}
//                 onClick={() => quickSearch(cityName)}
//                 disabled={loading}
//                 style={{
//                   background: 'rgba(255,255,255,0.1)',
//                   border: '1px solid rgba(255,255,255,0.2)',
//                   color: 'rgba(255,255,255,0.9)',
//                   padding: '6px 12px',
//                   borderRadius: '20px',
//                   fontSize: '0.85rem',
//                   cursor: 'pointer'
//                 }}
//               >
//                 {cityName}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div style={{
//             background: 'rgba(255,77,77,0.9)',
//             color: 'white',
//             padding: '16px 20px',
//             borderRadius: '12px',
//             marginBottom: '2rem',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center'
//           }}>
//             <span>{error}</span>
//             <button 
//               onClick={() => setError('')}
//               style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}
//             >
//               ×
//             </button>
//           </div>
//         )}

//         {/* Loading */}
//         {loading && (
//           <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
//             <div style={{
//               width: '60px',
//               height: '60px',
//               border: '3px solid rgba(255,255,255,0.3)',
//               borderTop: '3px solid white',
//               borderRadius: '50%',
//               animation: 'spin 1s linear infinite',
//               margin: '0 auto 1.5rem'
//             }}></div>
//             <h3 style={{ margin: '0 0 0.5rem 0' }}>Loading weather data...</h3>
//           </div>
//         )}

//         {/* Weather Display */}
//         {weather && !loading && (
//           <div style={{
//             background: 'rgba(255,255,255,0.15)',
//             backdropFilter: 'blur(20px)',
//             border: '2px solid rgba(255,255,255,0.2)',
//             borderRadius: '24px',
//             padding: '2rem',
//             marginBottom: '2rem'
//           }}>
            
//             {/* Location */}
//             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', opacity: '0.9' }}>
//               <MapPin size={18} />
//               <span style={{ fontSize: '1.1rem' }}>{weather.name}, {weather.sys.country}</span>
//               <button 
//                 onClick={() => fetchWeather()}
//                 style={{
//                   background: 'rgba(255,255,255,0.1)',
//                   border: '1px solid rgba(255,255,255,0.2)',
//                   color: 'rgba(255,255,255,0.8)',
//                   padding: '8px',
//                   borderRadius: '50%',
//                   cursor: 'pointer',
//                   marginLeft: 'auto'
//                 }}
//               >
//                 <RefreshCw size={16} />
//               </button>
//             </div>

//             {/* Main Weather */}
//             <div style={{ 
//               display: 'flex', 
//               justifyContent: 'space-between', 
//               alignItems: 'center', 
//               marginBottom: '2rem',
//               flexWrap: 'wrap',
//               gap: '2rem'
//             }}>
//               <div>
//                 <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
//                   <span style={{ fontSize: '4rem', fontWeight: '300', lineHeight: '1' }}>
//                     {convertTemp(weather.main.temp)}
//                   </span>
//                   <span style={{ fontSize: '2rem', fontWeight: '400', opacity: '0.8' }}>
//                     °{unit === 'celsius' ? 'C' : 'F'}
//                   </span>
//                 </div>
//                 <div style={{ fontSize: '1rem', opacity: '0.8', marginTop: '0.5rem' }}>
//                   Feels like {convertTemp(weather.main.feels_like)}°
//                 </div>
//               </div>
              
//               <div style={{ textAlign: 'center' }}>
//                 <WeatherIcon condition={weather.weather[0].main} size={80} />
//                 <div style={{ fontSize: '1.5rem', fontWeight: '600', marginTop: '1rem' }}>
//                   {weather.weather[0].main}
//                 </div>
//                 <div style={{ fontSize: '1rem', opacity: '0.8', textTransform: 'capitalize' }}>
//                   {weather.weather[0].description}
//                 </div>
//               </div>
//             </div>

//             {/* Weather Details */}
//             <div style={{ 
//               display: 'grid', 
//               gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
//               gap: '1rem' 
//             }}>
//               <div style={{
//                 background: 'rgba(255,255,255,0.1)',
//                 borderRadius: '12px',
//                 padding: '1rem',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '12px'
//               }}>
//                 <Droplets size={20} />
//                 <div>
//                   <div style={{ fontSize: '0.9rem', opacity: '0.8' }}>Humidity</div>
//                   <div style={{ fontSize: '1.3rem', fontWeight: '600' }}>{weather.main.humidity}%</div>
//                 </div>
//               </div>

//               <div style={{
//                 background: 'rgba(255,255,255,0.1)',
//                 borderRadius: '12px',
//                 padding: '1rem',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '12px'
//               }}>
//                 <Wind size={20} />
//                 <div>
//                   <div style={{ fontSize: '0.9rem', opacity: '0.8' }}>Wind Speed</div>
//                   <div style={{ fontSize: '1.3rem', fontWeight: '600' }}>{Math.round(weather.wind.speed * 3.6)} km/h</div>
//                 </div>
//               </div>

//               <div style={{
//                 background: 'rgba(255,255,255,0.1)',
//                 borderRadius: '12px',
//                 padding: '1rem',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '12px'
//               }}>
//                 <Eye size={20} />
//                 <div>
//                   <div style={{ fontSize: '0.9rem', opacity: '0.8' }}>Visibility</div>
//                   <div style={{ fontSize: '1.3rem', fontWeight: '600' }}>{Math.round(weather.visibility / 1000)} km</div>
//                 </div>
//               </div>

//               <div style={{
//                 background: 'rgba(255,255,255,0.1)',
//                 borderRadius: '12px',
//                 padding: '1rem',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '12px'
//               }}>
//                 <Thermometer size={20} />
//                 <div>
//                   <div style={{ fontSize: '0.9rem', opacity: '0.8' }}>Pressure</div>
//                   <div style={{ fontSize: '1.3rem', fontWeight: '600' }}>{weather.main.pressure} hPa</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* 5-Day Forecast */}
//         {forecast.length > 0 && !loading && (
//           <div style={{
//             background: 'rgba(255,255,255,0.15)',
//             backdropFilter: 'blur(20px)',
//             border: '2px solid rgba(255,255,255,0.2)',
//             borderRadius: '24px',
//             padding: '2rem'
//           }}>
//             <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.3rem' }}>5-Day Forecast</h3>
//             <div style={{ 
//               display: 'grid', 
//               gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
//               gap: '1rem' 
//             }}>
//               {forecast.map((day, index) => (
//                 <div key={index} style={{
//                   background: 'rgba(255,255,255,0.1)',
//                   borderRadius: '16px',
//                   padding: '1.5rem 1rem',
//                   textAlign: 'center'
//                 }}>
//                   <div style={{ fontWeight: '600', marginBottom: '0.5rem', opacity: '0.8' }}>
//                     {day.day}
//                   </div>
//                   <div style={{ marginBottom: '0.5rem' }}>
//                     <WeatherIcon condition={day.condition} size={32} />
//                   </div>
//                   <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem', opacity: '0.9' }}>
//                     {day.condition}
//                   </div>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
//                     <span style={{ fontWeight: '600' }}>{convertTemp(day.temp_max)}°</span>
//                     <span style={{ opacity: '0.7' }}>{convertTemp(day.temp_min)}°</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Welcome State */}
//         {!weather && !loading && !error && (
//           <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
//             <WeatherIcon condition="sunny" size={80} />
//             <h2 style={{ margin: '1.5rem 0 1rem', fontSize: '2rem' }}>Welcome to Weather Dashboard</h2>
//             <p style={{ fontSize: '1.1rem', opacity: '0.9' }}>Search for a city to get started with real-time weather information</p>
//           </div>
//         )}

//         {/* Footer */}
//         <footer style={{ textAlign: 'center', marginTop: '2rem', opacity: '0.7' }}>
//           <p>Built with React.js • Data updates every 30 seconds</p>
//         </footer>
//       </div>

//       <style jsx>{`
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default WeatherDashboard;

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