import React from 'react';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  Zap, 
  CloudDrizzle,
  Eye,
  Cloudy
} from 'lucide-react';
import styles from '../styles/App.module.css';

const WeatherIcon = ({ 
  condition, 
  size = 64, 
  className = '', 
  animated = false 
}) => {
  // Map weather conditions to appropriate icons and colors
  const getIcon = () => {
    const iconProps = {
      size,
      className: `${styles.weatherIcon} ${styles[condition?.toLowerCase()]} ${className} ${animated ? styles.animated : ''}`.trim(),
      'aria-label': `${condition} weather icon`
    };

    // Return appropriate icon based on weather condition
    switch (condition?.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return <Sun {...iconProps} />;
        
      case 'clouds':
      case 'cloudy':
      case 'partly cloudy':
        return <Cloud {...iconProps} />;
        
      case 'rain':
      case 'rainy':
      case 'light rain':
      case 'moderate rain':
      case 'heavy rain':
        return <CloudRain {...iconProps} />;
        
      case 'drizzle':
      case 'light drizzle':
        return <CloudDrizzle {...iconProps} />;
        
      case 'snow':
      case 'snowy':
      case 'light snow':
      case 'heavy snow':
        return <CloudSnow {...iconProps} />;
        
      case 'thunderstorm':
      case 'stormy':
      case 'thunder':
        return <Zap {...iconProps} />;
        
      case 'mist':
      case 'fog':
      case 'haze':
      case 'smoke':
      case 'dust':
        return <Eye {...iconProps} />;
        
      case 'overcast':
        return <Cloudy {...iconProps} />;
        
      default:
        // Default to sunny icon
        return <Sun {...iconProps} />;
    }
  };

  return (
    <div className={styles.weatherIconContainer}>
      {getIcon()}
    </div>
  );
};

// Specialized weather icon components for different use cases
export const CurrentWeatherIcon = ({ condition }) => (
  <WeatherIcon 
    condition={condition} 
    size={80} 
    className={styles.currentWeatherIcon} 
    animated={true}
  />
);

export const ForecastIcon = ({ condition }) => (
  <WeatherIcon 
    condition={condition} 
    size={32} 
    className={styles.forecastIcon}
  />
);

export const SmallWeatherIcon = ({ condition }) => (
  <WeatherIcon 
    condition={condition} 
    size={20} 
    className={styles.smallWeatherIcon}
  />
);

// Utility function to get weather description
export const getWeatherDescription = (condition) => {
  const descriptions = {
    clear: 'Clear skies with sunny conditions',
    sunny: 'Bright sunny weather',
    clouds: 'Cloudy skies',
    cloudy: 'Overcast conditions',
    rain: 'Rainy weather',
    rainy: 'Rain showers expected',
    drizzle: 'Light drizzle',
    snow: 'Snowy conditions',
    snowy: 'Snow falling',
    thunderstorm: 'Thunderstorm activity',
    stormy: 'Stormy weather',
    mist: 'Misty conditions',
    fog: 'Foggy weather',
    haze: 'Hazy atmosphere'
  };
  
  return descriptions[condition?.toLowerCase()] || 'Current weather conditions';
};

// Utility function to get weather-appropriate colors
export const getWeatherColor = (condition) => {
  const colors = {
    clear: '#ffd700',
    sunny: '#ffd700',
    clouds: '#87ceeb',
    cloudy: '#87ceeb',
    rain: '#4682b4',
    rainy: '#4682b4',
    drizzle: '#5f9ea0',
    snow: '#e6e6fa',
    snowy: '#e6e6fa',
    thunderstorm: '#9370db',
    stormy: '#9370db',
    mist: '#d3d3d3',
    fog: '#d3d3d3',
    haze: '#b0c4de'
  };
  
  return colors[condition?.toLowerCase()] || '#87ceeb';
};

export default WeatherIcon;