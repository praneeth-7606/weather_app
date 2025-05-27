import React, { createContext, useState, useEffect, useContext } from 'react';

// Create Weather Context
const WeatherContext = createContext();

// Custom hook to use weather context
export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

// Weather Context Provider Component
export const WeatherProvider = ({ children }) => {
  // State management for all weather data
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [city, setCity] = useState('');
  const [unit, setUnit] = useState('celsius');

  // API configuration
  const API_KEY = '32c4c18d9b89fe52222feb587433c873';
  const BASE_URL = 'https://api.openweathermap.org/data/2.5';

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedCity = localStorage.getItem('lastSearchedCity');
    const savedUnit = localStorage.getItem('temperatureUnit');
    
    if (savedCity) {
      setCity(savedCity);
      fetchWeatherData(savedCity);
    }
    
    if (savedUnit) {
      setUnit(savedUnit);
    }
  }, []);

  // Auto-refresh weather data every 30 seconds (API Polling)
  useEffect(() => {
    let interval;
    
    if (weather && city) {
      interval = setInterval(() => {
        console.log('Auto-refreshing weather data...');
        fetchWeatherData(city);
      }, 30000); // 30 seconds
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [weather, city]);

  // CORS handling with multiple fallback methods
  const fetchWithProxy = async (url) => {
    try {
      // Try direct fetch first
      const response = await fetch(url);
      if (response.ok) return response;
      throw new Error('Direct fetch failed');
    } catch (error) {
      // Try with CORS proxy
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      return await fetch(proxyUrl);
    }
  };

  // Main function to fetch weather data
  const fetchWeatherData = async (cityName) => {
    if (!cityName.trim()) {
      setError('Please enter a city name.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Fetch current weather
      const weatherUrl = `${BASE_URL}/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`;
      console.log('Fetching weather for:', cityName);
      
      const weatherResponse = await fetchWithProxy(weatherUrl);
      
      if (!weatherResponse.ok) {
        throw new Error(weatherResponse.status === 404 ? 'City not found. Please check the spelling and try again.' : 'Weather service error. Please try again later.');
      }
      
      const weatherData = await weatherResponse.json();
      console.log('Weather data received:', weatherData.name);

      setWeather(weatherData);
      setCity(cityName);
      
      // Save to localStorage
      localStorage.setItem('lastSearchedCity', cityName);

      // Fetch 5-day forecast (Bonus Feature)
      try {
        const forecastUrl = `${BASE_URL}/forecast?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`;
        const forecastResponse = await fetchWithProxy(forecastUrl);
        
        if (forecastResponse.ok) {
          const forecastData = await forecastResponse.json();
          
          // Process forecast - get one forecast per day around noon
          const dailyForecasts = {};
          forecastData.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dayKey = date.toDateString();
            const hour = date.getHours();
            
            if (!dailyForecasts[dayKey] || Math.abs(hour - 12) < Math.abs(dailyForecasts[dayKey].hour - 12)) {
              dailyForecasts[dayKey] = {
                day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                temp_max: Math.round(item.main.temp_max),
                temp_min: Math.round(item.main.temp_min),
                condition: item.weather[0].main,
                icon: item.weather[0].icon,
                description: item.weather[0].description,
                hour: hour
              };
            }
          });
          
          const today = new Date().toDateString();
          const processedForecast = Object.values(dailyForecasts)
            .filter(f => f.day !== today)
            .slice(0, 5);
          
          setForecast(processedForecast);
          console.log('5-day forecast processed');
        }
      } catch (err) {
        console.warn('⚠️ Forecast fetch failed:', err.message);
        setForecast([]);
      }

    } catch (err) {
      console.error('Weather fetch error:', err);
      
      // User-friendly error messages
      let errorMessage = err.message;
      if (err.message.includes('Failed to fetch') || err.message.includes('Network')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (err.message.includes('CORS')) {
        errorMessage = 'Unable to connect to weather service. Please try again or use a different browser.';
      }
      
      setError(errorMessage);
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  // Temperature conversion (Bonus Feature)
  const convertTemp = (temp) => {
    if (unit === 'fahrenheit') {
      return Math.round((temp * 9/5) + 32);
    }
    return Math.round(temp);
  };

  // Toggle temperature unit (Bonus Feature)
  const toggleUnit = () => {
    const newUnit = unit === 'celsius' ? 'fahrenheit' : 'celsius';
    setUnit(newUnit);
    localStorage.setItem('temperatureUnit', newUnit);
  };

  // Clear error message
  const clearError = () => {
    setError('');
  };

  // Manual refresh function
  const refreshWeather = () => {
    if (city) {
      fetchWeatherData(city);
    }
  };

  // Quick search for popular cities
  const quickSearchCity = (cityName) => {
    setCity(cityName);
    fetchWeatherData(cityName);
  };

  // Context value with all state and functions
  const contextValue = {
    // State
    weather,
    forecast,
    loading,
    error,
    city,
    unit,
    
    // Actions
    setCity,
    fetchWeatherData,
    convertTemp,
    toggleUnit,
    clearError,
    refreshWeather,
    quickSearchCity
  };

  return (
    <WeatherContext.Provider value={contextValue}>
      {children}
    </WeatherContext.Provider>
  );
};