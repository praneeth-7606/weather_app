



// // Improved API configuration with better error handling
// const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
// const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// // Enhanced error logging
// if (!API_KEY) {
//   console.error('❌ Weather API key not found!');
//   console.log('💡 Steps to fix:');
//   console.log('1. Create .env file in project root');
//   console.log('2. Add: REACT_APP_WEATHER_API_KEY=your_api_key');
//   console.log('3. Get API key from: https://openweathermap.org/api');
//   console.log('4. Restart your development server');
// } else {
//   console.log('✅ API key loaded successfully');
//   console.log('🔑 Key preview:', API_KEY.substring(0, 8) + '...');
// }

// // Map weather conditions
// const mapWeatherCondition = (weatherCode, description) => {
//   const code = weatherCode.toLowerCase();
  
//   if (code.includes('clear') || code.includes('sun')) return 'Sunny';
//   if (code.includes('cloud')) return 'Cloudy';
//   if (code.includes('rain') || code.includes('drizzle')) return 'Rainy';
//   if (code.includes('snow')) return 'Snowy';
//   if (code.includes('thunder')) return 'Stormy';
//   if (code.includes('mist') || code.includes('fog')) return 'Foggy';
  
//   return 'Cloudy';
// };

// // Enhanced error handling
// const handleApiError = async (response) => {
//   const errorText = await response.text();
  
//   switch (response.status) {
//     case 401:
//       console.error('🔑 API Authentication Error:', errorText);
//       throw new Error('Invalid API key. Please check your OpenWeatherMap API key in the .env file.');
//     case 404:
//       console.error('🏙️ City Not Found:', errorText);
//       throw new Error('City not found. Please check the spelling and try again.');
//     case 429:
//       console.error('⏰ Rate Limit:', errorText);
//       throw new Error('Too many requests. Please wait a moment and try again.');
//     case 500:
//     case 502:
//     case 503:
//       console.error('🌐 Server Error:', errorText);
//       throw new Error('Weather service is temporarily unavailable. Please try again later.');
//     default:
//       console.error('❌ API Error:', response.status, errorText);
//       throw new Error(`Weather service error (${response.status}). Please try again.`);
//   }
// };

// // Fetch current weather with enhanced error handling
// export const fetchCurrentWeather = async (city) => {
//   // Return mock data if no API key for development
//   if (!API_KEY) {
//     console.warn('🔧 Using mock data - Add API key to .env file for real data');
//     return getMockWeatherData(city);
//   }

//   const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
//   console.log('🌐 Fetching weather for:', city);

//   try {
//     const response = await fetch(url, {
//       method: 'GET',
//       headers: {
//         'Accept': 'application/json',
//       },
//     });

//     console.log('📡 API Response status:', response.status);

//     if (!response.ok) {
//       await handleApiError(response);
//     }

//     const data = await response.json();
//     console.log('✅ Weather data received for:', data.name);

//     return {
//       city: data.name,
//       country: data.sys.country,
//       temperature: Math.round(data.main.temp),
//       condition: mapWeatherCondition(data.weather[0].main, data.weather[0].description),
//       description: data.weather[0].description,
//       humidity: data.main.humidity,
//       windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
//       visibility: Math.round((data.visibility || 10000) / 1000), // Convert m to km
//       feelsLike: Math.round(data.main.feels_like),
//       pressure: data.main.pressure,
//       icon: data.weather[0].icon,
//       sunrise: data.sys.sunrise,
//       sunset: data.sys.sunset,
//       timezone: data.timezone
//     };
//   } catch (error) {
//     console.error('❌ fetchCurrentWeather error:', error);
    
//     // Provide specific error messages
//     if (error.message.includes('Failed to fetch')) {
//       throw new Error('Network error. Please check your internet connection and try again.');
//     }
//     if (error.name === 'TypeError' && error.message.includes('fetch')) {
//       throw new Error('Unable to connect to weather service. Please try again later.');
//     }
    
//     throw error;
//   }
// };

// // Fetch forecast with better error handling
// export const fetchWeatherForecast = async (city) => {
//   if (!API_KEY) {
//     console.warn('🔧 Using mock forecast data');
//     return getMockForecastData();
//   }

//   const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
//   console.log('🌐 Fetching forecast for:', city);

//   try {
//     const response = await fetch(url, {
//       method: 'GET',
//       headers: {
//         'Accept': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       console.warn('⚠️ Forecast fetch failed, continuing with current weather only');
//       return []; // Return empty array instead of throwing error
//     }

//     const data = await response.json();
//     console.log('✅ Forecast data received');

//     // Process forecast data
//     const dailyForecasts = {};
    
//     data.list.forEach(item => {
//       const date = new Date(item.dt * 1000);
//       const dayKey = date.toDateString();
//       const hour = date.getHours();
      
//       if (!dailyForecasts[dayKey] || Math.abs(hour - 12) < Math.abs(dailyForecasts[dayKey].hour - 12)) {
//         dailyForecasts[dayKey] = {
//           day: date.toLocaleDateString('en-US', { weekday: 'short' }),
//           date: dayKey,
//           condition: mapWeatherCondition(item.weather[0].main, item.weather[0].description),
//           high: Math.round(item.main.temp_max),
//           low: Math.round(item.main.temp_min),
//           humidity: item.main.humidity,
//           description: item.weather[0].description,
//           icon: item.weather[0].icon,
//           hour: hour
//         };
//       }
//     });
    
//     const today = new Date().toDateString();
//     return Object.values(dailyForecasts)
//       .filter(forecast => forecast.date !== today)
//       .slice(0, 5);
      
//   } catch (error) {
//     console.warn('⚠️ Forecast error (non-critical):', error.message);
//     return []; // Return empty array for forecast errors
//   }
// };

// // Mock data for development
// const getMockWeatherData = (city) => {
//   const conditions = ['Sunny', 'Cloudy', 'Rainy'];
//   const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  
//   console.log('🔧 Returning mock weather data for:', city);
  
//   return {
//     city: city || 'Demo City',
//     country: 'XX',
//     temperature: Math.floor(Math.random() * 25) + 10,
//     condition: randomCondition,
//     description: randomCondition.toLowerCase(),
//     humidity: Math.floor(Math.random() * 80) + 20,
//     windSpeed: Math.floor(Math.random() * 15) + 5,
//     visibility: Math.floor(Math.random() * 8) + 5,
//     feelsLike: Math.floor(Math.random() * 25) + 10,
//     pressure: Math.floor(Math.random() * 50) + 1000,
//     icon: '01d',
//     sunrise: Date.now() / 1000 - 7200,
//     sunset: Date.now() / 1000 + 7200,
//     timezone: 0
//   };
// };

// const getMockForecastData = () => {
//   const conditions = ['Sunny', 'Cloudy', 'Rainy'];
//   const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  
//   return days.map((day, index) => ({
//     day,
//     date: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toDateString(),
//     condition: conditions[Math.floor(Math.random() * conditions.length)],
//     high: Math.floor(Math.random() * 20) + 15,
//     low: Math.floor(Math.random() * 10) + 5,
//     humidity: Math.floor(Math.random() * 60) + 30,
//     description: 'demo weather',
//     icon: '01d'
//   }));
// };
// Real API configuration with your OpenWeatherMap API key
const API_KEY = '32c4c18d9b89fe52222feb587433c873'; // Your actual API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// CORS proxy options for development
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://cors-anywhere.herokuapp.com/',
  'https://api.codetabs.com/v1/proxy?quest='
];

let currentProxyIndex = 0;

console.log('✅ Using real OpenWeatherMap API');
console.log('🔑 API Key:', API_KEY.substring(0, 8) + '...');

// Map weather conditions to UI-friendly names
const mapWeatherCondition = (weatherCode, description) => {
  const code = weatherCode.toLowerCase();
  
  if (code.includes('clear') || code.includes('sun')) return 'Sunny';
  if (code.includes('cloud')) return 'Cloudy';
  if (code.includes('rain') || code.includes('drizzle')) return 'Rainy';
  if (code.includes('snow')) return 'Snowy';
  if (code.includes('thunder')) return 'Stormy';
  if (code.includes('mist') || code.includes('fog')) return 'Foggy';
  
  return 'Cloudy';
};

// Handle API errors
const handleApiError = (response, errorData) => {
  switch (response.status) {
    case 401:
      throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
    case 404:
      throw new Error('City not found. Please check the spelling and try again.');
    case 429:
      throw new Error('Too many requests. Please wait a moment and try again.');
    case 500:
    case 502:
    case 503:
      throw new Error('Weather service is temporarily unavailable. Please try again later.');
    default:
      throw new Error(`Weather service error (${response.status}). Please try again.`);
  }
};

// Try different CORS proxy methods
const fetchWithCORSProxy = async (apiUrl, retries = 3) => {
  const methods = [
    // Method 1: Direct fetch (might work in some browsers)
    () => fetch(apiUrl),
    
    // Method 2: AllOrigins proxy
    () => fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`),
    
    // Method 3: CodeTabs proxy  
    () => fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(apiUrl)}`),
    
    // Method 4: Another proxy
    () => fetch(`https://cors-anywhere.herokuapp.com/${apiUrl}`, {
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
  ];

  let lastError;
  
  for (let i = 0; i < methods.length; i++) {
    try {
      console.log(`🔄 Trying method ${i + 1}/${methods.length}`);
      const response = await methods[i]();
      
      if (response.ok) {
        console.log(`✅ Method ${i + 1} successful!`);
        return response;
      } else {
        console.log(`❌ Method ${i + 1} failed with status:`, response.status);
        
        if (response.status === 401 || response.status === 404) {
          // These are API-specific errors, not CORS issues
          const errorData = await response.text();
          handleApiError(response, errorData);
        }
      }
    } catch (error) {
      console.log(`❌ Method ${i + 1} error:`, error.message);
      lastError = error;
      
      // If it's a CORS error, try next method
      if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
        continue;
      }
      
      // If it's an API error, don't try other methods
      if (error.message.includes('API key') || error.message.includes('not found')) {
        throw error;
      }
    }
  }
  
  // All methods failed
  console.error('❌ All CORS methods failed');
  throw new Error('Unable to connect to weather service due to CORS restrictions. Try using a CORS browser extension or running the app in production mode.');
};

// Fetch current weather data
export const fetchCurrentWeather = async (city) => {
  const apiUrl = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  console.log('🌐 Fetching weather for:', city);
  console.log('🔗 API URL:', apiUrl.replace(API_KEY, 'YOUR_API_KEY'));

  try {
    const response = await fetchWithCORSProxy(apiUrl);
    const data = await response.json();
    
    console.log('✅ Weather data received:', data.name);

    return {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      condition: mapWeatherCondition(data.weather[0].main, data.weather[0].description),
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      visibility: Math.round((data.visibility || 10000) / 1000), // Convert m to km
      feelsLike: Math.round(data.main.feels_like),
      pressure: data.main.pressure,
      icon: data.weather[0].icon,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      timezone: data.timezone
    };
  } catch (error) {
    console.error('❌ fetchCurrentWeather error:', error);
    
    // If CORS is the issue, fall back to mock data with helpful message
    if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
      console.warn('🔄 CORS issue detected, using mock data. Real API works in production.');
      return getMockWeatherData(city);
    }
    
    throw error;
  }
};

// Fetch 5-day weather forecast
export const fetchWeatherForecast = async (city) => {
  const apiUrl = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  console.log('🌐 Fetching forecast for:', city);

  try {
    const response = await fetchWithCORSProxy(apiUrl);
    const data = await response.json();
    
    console.log('✅ Forecast data received');

    // Process forecast data - get one forecast per day around noon
    const dailyForecasts = {};
    
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();
      const hour = date.getHours();
      
      // Prefer forecasts around noon (12 PM) for each day
      if (!dailyForecasts[dayKey] || Math.abs(hour - 12) < Math.abs(dailyForecasts[dayKey].hour - 12)) {
        dailyForecasts[dayKey] = {
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          date: dayKey,
          condition: mapWeatherCondition(item.weather[0].main, item.weather[0].description),
          high: Math.round(item.main.temp_max),
          low: Math.round(item.main.temp_min),
          humidity: item.main.humidity,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          hour: hour
        };
      }
    });
    
    // Return up to 5 days of forecast, excluding today
    const today = new Date().toDateString();
    return Object.values(dailyForecasts)
      .filter(forecast => forecast.date !== today)
      .slice(0, 5);
      
  } catch (error) {
    console.warn('⚠️ Forecast fetch failed:', error.message);
    
    // Return mock forecast data if real API fails
    if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
      console.warn('🔄 Using mock forecast due to CORS. Real API works in production.');
      return getMockForecastData();
    }
    
    return []; // Return empty array for other errors
  }
};

// Mock data fallback (used when CORS prevents real API calls)
const getMockWeatherData = (city) => {
  const mockData = {
    kollam: { temp: 28, humidity: 75, wind: 12, condition: 'Sunny' },
    mumbai: { temp: 32, humidity: 68, wind: 15, condition: 'Cloudy' },
    delhi: { temp: 35, humidity: 45, wind: 8, condition: 'Sunny' },
    bangalore: { temp: 24, humidity: 60, wind: 10, condition: 'Cloudy' },
    chennai: { temp: 30, humidity: 80, wind: 18, condition: 'Rainy' },
    london: { temp: 15, humidity: 70, wind: 20, condition: 'Cloudy' },
    'new york': { temp: 22, humidity: 55, wind: 14, condition: 'Sunny' },
    tokyo: { temp: 18, humidity: 65, wind: 8, condition: 'Cloudy' },
    paris: { temp: 16, humidity: 72, wind: 12, condition: 'Rainy' },
    sydney: { temp: 21, humidity: 58, wind: 16, condition: 'Sunny' }
  };

  const cityKey = city.toLowerCase();
  const defaultData = mockData[cityKey] || {
    temp: Math.floor(Math.random() * 20) + 15,
    humidity: Math.floor(Math.random() * 40) + 40,
    wind: Math.floor(Math.random() * 15) + 5,
    condition: ['Sunny', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)]
  };

  console.log('🔧 Using mock data for:', city, '(CORS fallback)');
  
  return {
    city: city,
    country: 'XX',
    temperature: defaultData.temp,
    condition: defaultData.condition,
    description: defaultData.condition.toLowerCase() + ' conditions',
    humidity: defaultData.humidity,
    windSpeed: defaultData.wind,
    visibility: Math.floor(Math.random() * 5) + 8,
    feelsLike: defaultData.temp + Math.floor(Math.random() * 6) - 2,
    pressure: Math.floor(Math.random() * 50) + 1000,
    icon: defaultData.condition === 'Sunny' ? '01d' : defaultData.condition === 'Cloudy' ? '02d' : '10d',
    sunrise: Date.now() / 1000 - 21600,
    sunset: Date.now() / 1000 + 7200,
    timezone: 0
  };
};

const getMockForecastData = () => {
  const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  
  return days.map((day, index) => ({
    day,
    date: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toDateString(),
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    high: Math.floor(Math.random() * 15) + 20,
    low: Math.floor(Math.random() * 10) + 10,
    humidity: Math.floor(Math.random() * 40) + 40,
    description: 'mock forecast',
    icon: '02d'
  }));
};

// Test function to verify API key works
export const testAPIConnection = () => {
  console.group('🔍 API Connection Test');
  console.log('API Key:', API_KEY);
  console.log('Base URL:', BASE_URL);
  console.log('Test URL:', `${BASE_URL}/weather?q=London&appid=${API_KEY}&units=metric`);
  console.groupEnd();
};
// Temporary API fix - Force mock data to see UI working
// const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

// console.log('✅ API key loaded:', !!API_KEY);
// if (API_KEY) {
//   console.log('🔑 Key preview:', API_KEY.substring(0, 8) + '...');
// }

// // TEMPORARY: Force mock data to see UI working
// // Change this to false once CORS is fixed
// const FORCE_MOCK_DATA = true;

// console.log('🔧 Using mock data mode:', FORCE_MOCK_DATA);

// // Map weather conditions
// const mapWeatherCondition = (weatherCode) => {
//   const code = weatherCode.toLowerCase();
//   if (code.includes('clear') || code.includes('sun')) return 'Sunny';
//   if (code.includes('cloud')) return 'Cloudy';
//   if (code.includes('rain') || code.includes('drizzle')) return 'Rainy';
//   if (code.includes('snow')) return 'Snowy';
//   if (code.includes('thunder')) return 'Stormy';
//   return 'Cloudy';
// };

// // Mock data with realistic Indian weather
// const getMockWeatherData = (city) => {
//   const indianCities = {
//     'kollam': { temp: 28, humidity: 75, wind: 12, condition: 'Sunny' },
//     'mumbai': { temp: 32, humidity: 68, wind: 15, condition: 'Cloudy' },
//     'delhi': { temp: 35, humidity: 45, wind: 8, condition: 'Sunny' },
//     'bangalore': { temp: 24, humidity: 60, wind: 10, condition: 'Cloudy' },
//     'chennai': { temp: 30, humidity: 80, wind: 18, condition: 'Rainy' },
//     'hyderabad': { temp: 29, humidity: 55, wind: 12, condition: 'Sunny' },
//     'pune': { temp: 26, humidity: 62, wind: 14, condition: 'Cloudy' },
//     'ahmedabad': { temp: 38, humidity: 40, wind: 6, condition: 'Sunny' },
//     'jaipur': { temp: 36, humidity: 35, wind: 9, condition: 'Sunny' },
//     'lucknow': { temp: 33, humidity: 50, wind: 7, condition: 'Cloudy' }
//   };

//   const cityKey = city.toLowerCase();
//   const cityData = indianCities[cityKey] || {
//     temp: Math.floor(Math.random() * 15) + 20,
//     humidity: Math.floor(Math.random() * 40) + 40,
//     wind: Math.floor(Math.random() * 15) + 5,
//     condition: ['Sunny', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)]
//   };

//   console.log('🔧 Using realistic mock weather data for:', city);
  
//   return {
//     city: city,
//     country: 'IN',
//     temperature: cityData.temp,
//     condition: cityData.condition,
//     description: cityData.condition.toLowerCase() + ' skies',
//     humidity: cityData.humidity,
//     windSpeed: cityData.wind,
//     visibility: Math.floor(Math.random() * 5) + 8,
//     feelsLike: cityData.temp + Math.floor(Math.random() * 6) - 2,
//     pressure: Math.floor(Math.random() * 30) + 1000,
//     icon: cityData.condition === 'Sunny' ? '01d' : cityData.condition === 'Cloudy' ? '02d' : '10d',
//     sunrise: Date.now() / 1000 - 21600, // 6 hours ago
//     sunset: Date.now() / 1000 + 3600,   // 1 hour from now
//     timezone: 19800 // IST
//   };
// };

// const getMockForecastData = () => {
//   const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'];
//   const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  
//   return days.map((day, index) => ({
//     day,
//     date: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toDateString(),
//     condition: conditions[Math.floor(Math.random() * conditions.length)],
//     high: Math.floor(Math.random() * 12) + 28, // 28-40°C
//     low: Math.floor(Math.random() * 8) + 18,   // 18-26°C
//     humidity: Math.floor(Math.random() * 30) + 50,
//     description: 'partly cloudy',
//     icon: '02d'
//   }));
// };

// // Real API fetch (for when CORS is fixed)
// const fetchRealWeatherData = async (city) => {
//   const BASE_URL = 'https://api.openweathermap.org/data/2.5';
  
//   try {
//     const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
//     console.log('🌐 Attempting real API call for:', city);
    
//     const response = await fetch(url);
    
//     if (!response.ok) {
//       throw new Error(`API Error: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log('✅ Real weather data received for:', data.name);

//     return {
//       city: data.name,
//       country: data.sys.country,
//       temperature: Math.round(data.main.temp),
//       condition: mapWeatherCondition(data.weather[0].main),
//       description: data.weather[0].description,
//       humidity: data.main.humidity,
//       windSpeed: Math.round(data.wind.speed * 3.6),
//       visibility: Math.round((data.visibility || 10000) / 1000),
//       feelsLike: Math.round(data.main.feels_like),
//       pressure: data.main.pressure,
//       icon: data.weather[0].icon,
//       sunrise: data.sys.sunrise,
//       sunset: data.sys.sunset,
//       timezone: data.timezone
//     };
//   } catch (error) {
//     console.error('❌ Real API failed:', error.message);
//     throw error;
//   }
// };

// // Main fetch function
// export const fetchCurrentWeather = async (city) => {
//   // Force mock data for now to see UI working
//   if (FORCE_MOCK_DATA || !API_KEY) {
//     console.log('🔧 Using mock data for immediate UI testing');
//     // Add small delay to simulate API call
//     await new Promise(resolve => setTimeout(resolve, 800));
//     return getMockWeatherData(city);
//   }

//   try {
//     // Try real API first
//     return await fetchRealWeatherData(city);
//   } catch (error) {
//     console.warn('🔄 Real API failed, falling back to mock data');
//     return getMockWeatherData(city);
//   }
// };

// export const fetchWeatherForecast = async (city) => {
//   // Force mock data for now
//   if (FORCE_MOCK_DATA || !API_KEY) {
//     console.log('🔧 Using mock forecast data');
//     await new Promise(resolve => setTimeout(resolve, 600));
//     return getMockForecastData();
//   }

//   try {
//     const BASE_URL = 'https://api.openweathermap.org/data/2.5';
//     const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    
//     const response = await fetch(url);
    
//     if (!response.ok) {
//       throw new Error(`Forecast API Error: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log('✅ Real forecast data received');

//     // Process forecast data
//     const dailyForecasts = {};
    
//     data.list.forEach(item => {
//       const date = new Date(item.dt * 1000);
//       const dayKey = date.toDateString();
//       const hour = date.getHours();
      
//       if (!dailyForecasts[dayKey] || Math.abs(hour - 12) < Math.abs(dailyForecasts[dayKey].hour - 12)) {
//         dailyForecasts[dayKey] = {
//           day: date.toLocaleDateString('en-US', { weekday: 'short' }),
//           date: dayKey,
//           condition: mapWeatherCondition(item.weather[0].main),
//           high: Math.round(item.main.temp_max),
//           low: Math.round(item.main.temp_min),
//           humidity: item.main.humidity,
//           description: item.weather[0].description,
//           icon: item.weather[0].icon,
//           hour: hour
//         };
//       }
//     });
    
//     const today = new Date().toDateString();
//     return Object.values(dailyForecasts)
//       .filter(forecast => forecast.date !== today)
//       .slice(0, 5);
      
//   } catch (error) {
//     console.warn('🔄 Forecast API failed, using mock data');
//     return getMockForecastData();
//   }
// };