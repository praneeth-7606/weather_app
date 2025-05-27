import React from 'react';
import { 
  MapPin, 
  Wind, 
  Droplets, 
  Eye, 
  Thermometer, 
  RefreshCw,
  Sunrise,
  Sunset
} from 'lucide-react';
// import { useWeather } from '../context/WeatherContext';
import { useWeather } from '../context/wheathercontext';
// import { CurrentWeatherIcon, ForecastIcon } from './WeatherIcon';
import { CurrentWeatherIcon, ForecastIcon } from './wheathericon';
import styles from '../styles/App.module.css';

const WeatherDisplay = () => {
  // Get all weather data and functions from Context API
  const { 
    weather, 
    forecast, 
    loading, 
    convertTemp, 
    unit, 
    refreshWeather,
    city
  } = useWeather();

  // Loading state component
  const LoadingState = () => (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner} aria-label="Loading weather data"></div>
      <h3 className={styles.loadingTitle}>Loading weather data...</h3>
      <p className={styles.loadingText}>Please wait while we fetch the latest information</p>
    </div>
  );

  // Welcome state component (when no weather data)
  const WelcomeState = () => (
    <div className={styles.welcomeContainer}>
      <CurrentWeatherIcon condition="sunny" />
      <h2 className={styles.welcomeTitle}>Welcome to Weather Dashboard</h2>
      <p className={styles.welcomeText}>
        Search for a city to get started with real-time weather information
      </p>
      <div className={styles.welcomeFeatures}>
        <div className={styles.featureItem}>
          <Thermometer size={24} />
          <span>Real-time temperature</span>
        </div>
        <div className={styles.featureItem}>
          <Wind size={24} />
          <span>Wind conditions</span>
        </div>
        <div className={styles.featureItem}>
          <Droplets size={24} />
          <span>Humidity levels</span>
        </div>
      </div>
    </div>
  );

  // Current weather section component
  const CurrentWeatherSection = ({ weatherData }) => {
    // Format timestamp to readable time
    const formatTime = (timestamp) => {
      return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    return (
      <div className={styles.currentWeather}>
        {/* Weather Header with Location and Refresh */}
        <div className={styles.weatherHeader}>
          <div className={styles.locationInfo}>
            <MapPin size={18} />
            <span className={styles.locationText}>
              {weatherData.name}, {weatherData.sys.country}
            </span>
          </div>
          <button 
            onClick={refreshWeather}
            className={styles.refreshButton}
            title="Refresh weather data"
            aria-label="Refresh current weather data"
          >
            <RefreshCw size={16} />
          </button>
        </div>
        
        {/* Main Weather Display */}
        <div className={styles.mainWeather}>
          {/* Temperature Section */}
          <div className={styles.temperatureSection}>
            <div className={styles.temperatureDisplay}>
              <span className={styles.temperatureValue}>
                {convertTemp(weatherData.main.temp)}
              </span>
              <span className={styles.temperatureUnit}>
                °{unit === 'celsius' ? 'C' : 'F'}
              </span>
            </div>
            <div className={styles.feelsLike}>
              Feels like {convertTemp(weatherData.main.feels_like)}°
            </div>
          </div>
          
          {/* Weather Condition Section */}
          <div className={styles.conditionSection}>
            <CurrentWeatherIcon condition={weatherData.weather[0].main} />
            <div className={styles.conditionText}>
              <span className={styles.conditionMain}>
                {weatherData.weather[0].main}
              </span>
              <span className={styles.conditionDescription}>
                {weatherData.weather[0].description}
              </span>
            </div>
          </div>
        </div>

        {/* Sunrise/Sunset Times */}
        {weatherData.sys.sunrise && weatherData.sys.sunset && (
          <div className={styles.sunTimes}>
            <div className={styles.sunTime}>
              <Sunrise size={16} />
              <span>Sunrise: {formatTime(weatherData.sys.sunrise)}</span>
            </div>
            <div className={styles.sunTime}>
              <Sunset size={16} />
              <span>Sunset: {formatTime(weatherData.sys.sunset)}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Weather details grid component
  const WeatherDetailsGrid = ({ weatherData }) => {
    const weatherDetails = [
      {
        icon: <Droplets size={20} />,
        label: 'Humidity',
        value: `${weatherData.main.humidity}%`,
        description: weatherData.main.humidity > 70 ? 'High' : 
                    weatherData.main.humidity < 30 ? 'Low' : 'Moderate'
      },
      {
        icon: <Wind size={20} />,
        label: 'Wind Speed',
        value: `${Math.round(weatherData.wind.speed * 3.6)} km/h`,
        description: weatherData.wind.speed * 3.6 > 20 ? 'Windy' : 'Calm'
      },
      {
        icon: <Eye size={20} />,
        label: 'Visibility',
        value: `${Math.round(weatherData.visibility / 1000)} km`,
        description: weatherData.visibility / 1000 > 8 ? 'Clear' : 
                    weatherData.visibility / 1000 > 4 ? 'Moderate' : 'Poor'
      },
      {
        icon: <Thermometer size={20} />,
        label: 'Pressure',
        value: `${weatherData.main.pressure} hPa`,
        description: weatherData.main.pressure > 1020 ? 'High' : 
                    weatherData.main.pressure < 1000 ? 'Low' : 'Normal'
      }
    ];

    return (
      <div className={styles.weatherDetails}>
        <h3 className={styles.detailsTitle}>Weather Details</h3>
        <div className={styles.detailsGrid}>
          {weatherDetails.map((detail, index) => (
            <div key={index} className={styles.detailCard}>
              <div className={styles.detailHeader}>
                {detail.icon}
                <span className={styles.detailLabel}>{detail.label}</span>
              </div>
              <div className={styles.detailValue}>{detail.value}</div>
              <div className={styles.detailDescription}>{detail.description}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 5-day forecast section component (Bonus Feature)
  const ForecastSection = ({ forecastData }) => {
    return (
      <div className={styles.forecastSection}>
        <h3 className={styles.forecastTitle}>5-Day Forecast</h3>
        <div className={styles.forecastGrid}>
          {forecastData.map((day, index) => (
            <div key={index} className={styles.forecastCard}>
              <div className={styles.forecastDay}>{day.day}</div>
              <div className={styles.forecastIconWrapper}>
                <ForecastIcon condition={day.condition} />
              </div>
              <div className={styles.forecastCondition}>{day.condition}</div>
              <div className={styles.forecastTemps}>
                <span className={styles.tempHigh}>
                  {convertTemp(day.temp_max)}°
                </span>
                <span className={styles.tempSeparator}>/</span>
                <span className={styles.tempLow}>
                  {convertTemp(day.temp_min)}°
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Main render logic
  if (loading) {
    return <LoadingState />;
  }

  if (!weather) {
    return <WelcomeState />;
  }

  return (
    <div className={styles.weatherDisplay}>
      {/* Current Weather Section */}
      <CurrentWeatherSection weatherData={weather} />
      
      {/* Weather Details Grid */}
      <WeatherDetailsGrid weatherData={weather} />
      
      {/* 5-Day Forecast (if available) */}
      {forecast.length > 0 && <ForecastSection forecastData={forecast} />}
    </div>
  );
};

export default WeatherDisplay;