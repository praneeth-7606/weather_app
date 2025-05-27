import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
// import { useWeather } from '../context/WeatherContext';
import { useWeather } from '../context/wheathercontext';
import styles from '../styles/App.module.css';

const SearchInput = () => {
  // Get state and functions from Context API
  const { 
    city, 
    setCity, 
    fetchWeatherData, 
    loading, 
    quickSearchCity 
  } = useWeather();

  // Local state for geolocation loading
  const [geoLoading, setGeoLoading] = useState(false);

  // Handle search form submission
  const handleSearch = () => {
    if (city.trim()) {
      fetchWeatherData(city.trim());
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  // Get user's current location (Fixed Implementation)
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Use coordinates to get city name or search with coordinates
        // For now, we'll search for a demo city based on rough location
        const demoCity = getLocationBasedCity(latitude, longitude);
        quickSearchCity(demoCity);
        setGeoLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setGeoLoading(false);
        
        // More user-friendly error messages
        let errorMessage = 'Unable to get your location. ';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Location access was denied. Please enable location services and try again.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable. Please search for a city manually.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out. Please try again or search manually.';
            break;
          default:
            errorMessage += 'Please search for a city manually.';
            break;
        }
        
        alert(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Helper function to get demo city based on coordinates
  const getLocationBasedCity = (lat, lon) => {
    // Simple logic to determine region and return a demo city
    // In real implementation, you'd use reverse geocoding API
    
    if (lat >= 8 && lat <= 37 && lon >= 68 && lon <= 97) {
      // India region
      return 'Mumbai'; // or use coordinates in API call
    } else if (lat >= 25 && lat <= 49 && lon >= -125 && lon <= -66) {
      // USA region
      return 'New York';
    } else if (lat >= 36 && lat <= 71 && lon >= -10 && lon <= 40) {
      // Europe region
      return 'London';
    } else if (lat >= -45 && lat <= -10 && lon >= 110 && lon <= 155) {
      // Australia region
      return 'Sydney';
    } else {
      // Default fallback
      return 'London';
    }
  };

  // Alternative: Real implementation with reverse geocoding
  const handleCurrentLocationWithReverseGeocoding = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use OpenWeatherMap reverse geocoding API
          const API_KEY = '32c4c18d9b89fe52222feb587433c873';
          const reverseGeoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
          
          const response = await fetch(reverseGeoUrl);
          if (response.ok) {
            const locationData = await response.json();
            if (locationData.length > 0) {
              const cityName = locationData[0].name;
              quickSearchCity(cityName);
            } else {
              quickSearchCity('Current Location');
            }
          } else {
            // Fallback to demo city
            const demoCity = getLocationBasedCity(latitude, longitude);
            quickSearchCity(demoCity);
          }
        } catch (error) {
          console.error('Reverse geocoding failed:', error);
          // Fallback to demo city
          const demoCity = getLocationBasedCity(latitude, longitude);
          quickSearchCity(demoCity);
        } finally {
          setGeoLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setGeoLoading(false);
        
        let errorMessage = 'Unable to get your location. ';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please enable location services in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location services are currently unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
            break;
        }
        
        alert(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  return (
    <div className={styles.searchContainer}>
      {/* Main Search Input */}
      <div className={styles.searchInputWrapper}>
        <Search 
          size={20} 
          className={styles.searchIcon}
          aria-label="Search icon"
        />
        <input
          type="text"
          value={city}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Search for a city..."
          disabled={loading}
          className={styles.searchInput}
          aria-label="City search input"
          autoComplete="off"
        />
        <button 
          onClick={handleCurrentLocation}
          disabled={loading || geoLoading}
          className={styles.locationButton}
          title="Use current location"
          aria-label="Get current location weather"
        >
          {geoLoading ? (
            <div style={{ 
              width: '16px', 
              height: '16px', 
              border: '2px solid rgba(255,255,255,0.3)',
              borderTop: '2px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          ) : (
            <MapPin size={16} />
          )}
        </button>
        <button 
          onClick={handleSearch}
          disabled={loading || !city.trim()}
          className={styles.searchButton}
          aria-label="Search weather"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Quick Search Buttons */}
      <div className={styles.quickSearch}>
        <span className={styles.quickSearchLabel}>Quick search:</span>
        {['Kollam', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'London', 'New York'].map((cityName) => (
          <button
            key={cityName}
            onClick={() => quickSearchCity(cityName)}
            disabled={loading}
            className={styles.quickSearchButton}
            aria-label={`Search weather for ${cityName}`}
          >
            {cityName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchInput;