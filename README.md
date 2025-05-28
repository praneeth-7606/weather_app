# Weather Dashboard

<div align="center">

![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![OpenWeatherMap](https://img.shields.io/badge/OpenWeatherMap-API-orange?style=for-the-badge)
![CSS Modules](https://img.shields.io/badge/CSS-Modules-green?style=for-the-badge&logo=css3)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript)
![Supabase](https://img.shields.io/badge/Supabase-Authentication-purple?style=for-the-badge&logo=supabase)

**A modern, responsive weather dashboard built with React.js featuring secure authentication and a beautiful glassmorphism UI design.**

[Live Demo](https://weather-app-dun-gamma-77.vercel.app/) • [Documentation](#documentation) • [Quick Start](#-quick-start) • [Screenshots](#screenshots)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Technologies Used](#️-technologies-used)
- [Quick Start](#-quick-start)
- [Authentication Setup](#-authentication-setup)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Assignment Requirements](#-assignment-requirements)
- [API Integration](#-api-integration)
- [UI/UX Features](#-uiux-features)
- [Responsive Design](#-responsive-design)
- [Accessibility](#-accessibility)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 🔑 Features

### **Authentication Features**
- **Secure User Registration** - Create an account with email and password
- **Protected Dashboard** - Weather data only accessible to authenticated users
- **Persistent Sessions** - Stay logged in across browser sessions
- **User Profiles** - Save preferences and search history
- **Password Reset** - Secure password recovery flow
- **Error Handling** - Comprehensive authentication error management
- **Logout Functionality** - End sessions securely

### **Core Weather Features**
- **Real-time Weather Data** - Current conditions with auto-refresh every 30 seconds
- **City Search** - Search for weather in any city worldwide with autocomplete
- **5-Day Forecast** - Extended weather predictions with daily high/low temperatures
- **Weather Details** - Comprehensive information including humidity, wind speed, visibility, and pressure
- **Dynamic Weather Icons** - Contextual icons that change based on weather conditions
- **Geolocation Support** - Get weather for your current location with one click

### **Smart Functionality**
- **Auto-refresh** - Weather data updates automatically every 30 seconds
- **Local Storage** - Remembers your last searched city and preferences
- **Unit Conversion** - Toggle between Celsius and Fahrenheit
- **Quick Search** - One-click access to popular cities
- **Error Handling** - User-friendly error messages and recovery options
- **Offline Graceful Degradation** - Handles network issues elegantly
- **Search History** - View and access your recent searches

### **Modern UI/UX**
- **Glassmorphism Design** - Beautiful glass-like interface with backdrop blur effects
- **Smooth Animations** - Engaging hover effects, loading states, and transitions
- **Responsive Layout** - Perfect experience on desktop, tablet, and mobile devices
- **Dark Theme Integration** - Automatically adapts to system theme preferences
- **Accessibility First** - Full keyboard navigation and screen reader support

---

## 🛠️ Technologies Used

### **Authentication & Backend**
- **Supabase** - Authentication, user management, and database
- **JWT Tokens** - Secure session management
- **Row-Level Security** - Data isolation and protection

### **Frontend Framework**
- **React 18.2.0** - Modern React with functional components and hooks
- **JavaScript ES6+** - Latest JavaScript features and syntax

### **Styling & Design**
- **CSS Modules** - Scoped styling to prevent conflicts
- **CSS3 Animations** - Smooth transitions and micro-interactions
- **Responsive Design** - Mobile-first approach with flexbox and grid

### **State Management**
- **React Context API** - Global state management without external libraries
- **Custom Hooks** - Reusable logic and clean component architecture

### **External APIs**
- **OpenWeatherMap API** - Real-time weather data and forecasts
- **Geolocation API** - Browser-based location services

### **Development Tools**
- **Create React App** - Modern React development environment
- **Lucide React** - Beautiful, customizable icons
- **ES6 Modules** - Modern import/export syntax

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js (v14.0.0 or higher)
- npm or yarn package manager
- OpenWeatherMap API key (free)
- Supabase account (free)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/weather-dashboard.git
   cd weather-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Open your browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - You'll see the login screen (authentication required)
   - Create an account or sign in to access the weather dashboard

---

## 🔐 Authentication Setup

### **Quick Supabase Setup (5 minutes)**

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "Start your project" 
   - Sign up/Login with GitHub
   - Click "New Project"
   - Fill in:
     - **Name**: `weather-dashboard`
     - **Database Password**: (create strong password)
     - **Region**: (choose closest to you)
   - Click "Create new project"
   - Wait 2-3 minutes for setup

2. **Get API Keys**
   - Go to **Settings → API** in Supabase dashboard
   - Copy these values:
     - **Project URL** (like: `https://abcdefgh.supabase.co`)
     - **anon public key** (long string starting with `eyJ...`)

3. **Update Environment Variables**
   ```bash
   # Create .env file in the root directory
   cp .env.example .env
   
   # Add your API keys
   REACT_APP_WEATHER_API_KEY=your_openweathermap_api_key_here
   REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **Set Up Database Tables**
   - Go to **SQL Editor** in Supabase
   - Copy contents from `supabase-setup.sql` in project files
   - Paste and click **"Run"**
   - Database ready!

5. **Restart Application**
   ```bash
   npm start
   ```

> **Note**: For testing purposes, the application works without Supabase setup, displaying a fully functional login interface with validation. Real authentication requires completing the Supabase setup.

---

## 📁 Project Structure

```
weather-dashboard/
├── 📁 public/                     # Static assets
│   ├── index.html                 # HTML template
│   ├── favicon.ico                # App icon
│   └── manifest.json              # PWA manifest
├── 📁 src/                        # Source code
│   ├── 📁 components/             # React components
│   │   ├── 📁 auth/               # Authentication components
│   │   │   ├── LoginPage.js       # 🔑 Full-screen login page
│   │   │   ├── RegisterForm.js    # 📝 User registration form
│   │   │   ├── LoginForm.js       # 🔓 User login form
│   │   │   └── PasswordReset.js   # 🔄 Password reset component
│   │   ├── SearchInput.js         # 🔍 City search functionality
│   │   ├── WeatherDisplay.js      # 🌤️ Main weather information
│   │   ├── ErrorMessage.js        # ❌ Error handling component
│   │   └── WeatherIcon.js         # 🌟 Dynamic weather icons
│   ├── 📁 context/                # State management
│   │   ├── AuthContext.js         # 🔐 Authentication state
│   │   └── WeatherContext.js      # 🌐 Weather state
│   ├── 📁 config/                 # Configuration
│   │   └── supabase.js            # 🔌 Supabase client setup
│   ├── 📁 styles/                 # Styling files
│   │   ├── App.module.css         # 🎨 Main component styles
│   │   ├── Auth.module.css        # 🔒 Authentication styles
│   │   └── index.css              # 🌍 Global styles
│   ├── App.js                     # 🏠 Main application component
│   └── index.js                   # 🚪 React entry point
├── 📁 scripts/                    # Helper scripts
│   └── supabase-setup.sql         # 📊 Database setup script
├── .env                           # 🔐 Environment variables
├── .gitignore                     # 📝 Git ignore rules
├── package.json                   # 📦 Dependencies and scripts
└── README.md                      # 📖 Project documentation
```

---

## 🔧 Configuration

### **Environment Variables**

Create a `.env` file in the root directory:

```env
# OpenWeatherMap API Configuration
REACT_APP_WEATHER_API_KEY=your_openweathermap_api_key_here

# Supabase Authentication Configuration
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional Configuration
REACT_APP_WEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
REACT_APP_DEFAULT_CITY=London
REACT_APP_REFRESH_INTERVAL=30000
```

### **API Key Setup**

#### OpenWeatherMap API
1. **Sign up** at [OpenWeatherMap](https://openweathermap.org/api)
2. **Generate** a free API key
3. **Add** the key to your `.env` file

#### Supabase Setup
1. **Create project** at [Supabase](https://supabase.com)
2. **Copy** Project URL and anon key
3. **Add** these values to your `.env` file

> **Important**: Never commit your `.env` file to version control. API keys should remain private.

---

## 📱 Usage

### **Authentication Flow**

1. **Registration**
   - Open the application to see the login screen
   - Click "Create Account"
   - Fill in your email and password
   - Submit the form to create your account

2. **Login**
   - Enter your email and password
   - Click "Sign In" to access the dashboard
   - Toggle "Remember Me" to stay logged in

3. **Password Reset**
   - Click "Forgot Password" on the login screen
   - Enter your email address
   - Follow instructions sent to your email

4. **Logout**
   - Click your username in the top right corner
   - Select "Logout" from the dropdown
   - You'll be returned to the login screen

### **Weather Features**

1. **Search for a City**
   - Type a city name in the search bar
   - Press Enter or click the Search button
   - View real-time weather information

2. **Use Quick Search**
   - Click any of the preset city buttons
   - Instantly get weather for popular locations

3. **Get Current Location Weather**
   - Click the location icon (📍)
   - Allow location access when prompted
   - View weather for your current location

4. **Toggle Temperature Units**
   - Click the °C/°F button in the header
   - Switch between Celsius and Fahrenheit
   - Preference is saved automatically

5. **View Search History**
   - See your recent searches below the search bar
   - Click any previous search to reload that city's weather

### **Advanced Features**

- **Auto-refresh** - Weather updates every 30 seconds automatically
- **5-Day Forecast** - Scroll down to see extended predictions
- **Error Recovery** - Click retry if any errors occur
- **Responsive Design** - Works perfectly on all device sizes

---

## 🧪 Testing the Authentication Flow

### **Test Cases to Try:**

#### **1. Sign Up Flow**
- Click "Create Account"
- Fill in: Email, Password, Confirm Password
- Test validation errors:
  - Empty fields
  - Invalid email format
  - Password too short
  - Passwords don't match
- Submit valid form
- Should redirect to weather dashboard

#### **2. Sign In Flow**  
- Click "Sign In"
- Test with invalid credentials
- Test with valid credentials
- Should access weather dashboard

#### **3. Weather Dashboard (After Login)**
- Search for cities
- Toggle temperature units
- View user menu (top right)
- Check search history
- Sign out
- Should return to login page

#### **4. Error Handling**
- Try accessing without login
- Test network errors
- Test invalid API keys
- All errors should be handled gracefully

---

## 🎯 Assignment Requirements

This project fulfills all the specified assignment requirements:

### ✅ **Project Setup**
- [x] **Create React App** - Modern React development environment
- [x] **Functional Components** - All components use hooks-based approach
- [x] **CSS Modules** - Scoped styling with `App.module.css`
- [x] **Authentication** - Secure user authentication system

### ✅ **Features & Functionality**
- [x] **Authentication System** - Complete login/register flow
- [x] **Home Page Dashboard** - Complete weather dashboard interface
- [x] **City Search** - Real-time city search with results
- [x] **Weather Display** - Temperature, humidity, wind speed, conditions
- [x] **Weather Icons** - Dynamic icons from external API
- [x] **API Integration** - OpenWeatherMap API integration
- [x] **30-Second Polling** - Automatic data refresh
- [x] **Error Handling** - Comprehensive error management
- [x] **Local Storage** - Persistent user preferences
- [x] **Database Storage** - User data and search history

### ✅ **Component Structure**
- [x] **Authentication Components** - Login, register, password reset
- [x] **SearchInput Component** - Dedicated search functionality
- [x] **WeatherDisplay Component** - Weather information display
- [x] **ErrorMessage Component** - Error handling and display
- [x] **WeatherIcon Component** - Dynamic weather icons

### ✅ **State Management**
- [x] **React Context API** - Global state management
- [x] **Authentication Context** - User session management
- [x] **Custom Hooks** - Clean, reusable logic

### ✅ **Bonus Features**
- [x] **5-Day Forecast** - Extended weather predictions
- [x] **Unit Toggle** - Celsius/Fahrenheit conversion
- [x] **Responsive Design** - Mobile-first approach
- [x] **Geolocation** - Current location weather
- [x] **Advanced Error Handling** - User-friendly error recovery
- [x] **Search History** - Record of previous searches

### ✅ **Code Quality**
- [x] **Clean Architecture** - Modular, maintainable code
- [x] **React Best Practices** - Proper hooks usage and patterns
- [x] **Modern JavaScript** - ES6+ features and syntax
- [x] **Accessibility** - WCAG compliant interface

---

## 🔄 API Integration

### **Supabase Authentication API**
- User registration and login
- Session management
- Password recovery
- User profiles and preferences

### **OpenWeatherMap APIs Used**

1. **Current Weather API**
   ```javascript
   GET https://api.openweathermap.org/data/2.5/weather
   ```
   - Real-time weather conditions
   - Temperature, humidity, pressure
   - Wind speed and direction
   - Weather descriptions and icons

2. **5-Day Forecast API**
   ```javascript
   GET https://api.openweathermap.org/data/2.5/forecast
   ```
   - 5-day weather predictions
   - 3-hour interval data
   - Daily high/low temperatures
   - Weather trends and patterns

3. **Reverse Geocoding API**
   ```javascript
   GET https://api.openweathermap.org/geo/1.0/reverse
   ```
   - Convert coordinates to city names
   - Support for geolocation features

### **Error Handling Strategy**

- **Authentication Errors** - Clear feedback on login/signup issues
- **Network Errors** - Retry mechanism with exponential backoff
- **API Rate Limits** - User-friendly rate limit notifications
- **Invalid Cities** - Helpful suggestions and error messages
- **CORS Issues** - Multiple proxy fallback methods for development

---

## 🎨 UI/UX Features

### **Authentication UI**
- **Glassmorphism Login** - Beautiful, modern authentication screens
- **Form Validation** - Real-time feedback on input errors
- **Success/Error States** - Clear visual feedback on actions
- **Smooth Transitions** - Elegant animations between auth states

### **Design System**
- **Color Palette** - Purple-blue gradient with glassmorphism accents
- **Typography** - Inter font family for modern, readable text
- **Spacing** - Consistent 8px grid system throughout
- **Shadows** - Subtle depth with backdrop blur effects

### **Interactive Elements**
- **Hover Effects** - Smooth transitions on all interactive elements
- **Loading States** - Engaging spinners and skeleton screens
- **Focus Indicators** - Clear keyboard navigation feedback
- **Button States** - Disabled, hover, and active state styling

### **Visual Hierarchy**
- **Primary Information** - Large, bold temperature display
- **Secondary Details** - Organized in intuitive card layouts
- **Supporting Data** - Subtle but accessible additional information

---

## 📱 Responsive Design

### **Breakpoints**
- **Desktop** - 1200px+ (Full feature layout)
- **Tablet** - 768px-1199px (Adapted grid layout)
- **Mobile** - 320px-767px (Stacked vertical layout)

### **Mobile Optimizations**
- **Touch-friendly** - 44px minimum tap targets
- **Readable Text** - Optimized font sizes for mobile screens
- **Simplified Navigation** - Streamlined mobile interface
- **Fast Loading** - Optimized images and minimal JavaScript
- **Mobile Auth Forms** - Optimized for small screens

### **Progressive Enhancement**
- **Core Functionality** - Works without JavaScript
- **Enhanced Experience** - Rich interactions with JavaScript
- **Offline Support** - Graceful degradation without network

---

## ♿ Accessibility

### **WCAG 2.1 Compliance**
- **Level AA** - Meets accessibility standards
- **Color Contrast** - 4.5:1 minimum contrast ratio
- **Keyboard Navigation** - Full keyboard accessibility
- **Screen Readers** - Semantic HTML and ARIA labels

### **Inclusive Features**
- **Reduced Motion** - Respects user's motion preferences
- **High Contrast** - Support for high contrast mode
- **Focus Management** - Logical tab order and focus indicators
- **Error Identification** - Clear error messages and recovery paths

---

## 🚀 Deployment

### **Build for Production**
```bash
npm run build
```

### **Deploy to Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

### **Deploy to Netlify**
1. Build the project: `npm run build`
2. Upload the `build` folder to Netlify
3. Set environment variables in Netlify dashboard

### **Environment Variables for Production**
Set these variables in your deployment platform:
- `REACT_APP_WEATHER_API_KEY`
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`

---

## 🧪 Testing

### **Authentication Testing**
- [x] User registration flow
- [x] Login with valid credentials
- [x] Login with invalid credentials
- [x] Password reset functionality
- [x] Session persistence
- [x] Protected routes
- [x] Logout functionality

### **Weather Feature Testing**
- [x] Search functionality with various city names
- [x] Weather data display for different locations
- [x] Unit conversion (°C/°F) functionality
- [x] Geolocation feature
- [x] Error handling for various scenarios
- [x] Auto-refresh functionality
- [x] Local storage for preferences
- [x] Responsive design on all screen sizes

### **Browser Compatibility**
- ✅ Chrome 90+
- ✅ Firefox 90+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🤝 Contributing

We welcome contributions to improve the Weather Dashboard! Here's how you can help:

### **Getting Started**
1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature-name`
3. **Make** your changes with proper commit messages
4. **Test** your changes thoroughly
5. **Submit** a pull request with a clear description

### **Areas for Contribution**
- 🔒 Authentication enhancements
- 🐛 Bug fixes and error handling improvements
- ✨ New features and enhancements
- 🎨 UI/UX improvements and animations
- 📱 Mobile experience optimizations
- ♿ Accessibility improvements
- 📚 Documentation updates

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Weather Dashboard

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 👨‍💻 Author



## 🙏 Acknowledgments

- **OpenWeatherMap** - For providing free weather data API
- **Supabase** - For the excellent authentication platform
- **Lucide React** - For beautiful, customizable icons
- **React Team** - For the amazing React framework
- **Create React App** - For the excellent development environment
- **CSS Tricks** - For glassmorphism design inspiration
- **MDN Web Docs** - For comprehensive web development documentation

---

## 🔮 Future Enhancements

- [ ] **Social Authentication** - Login with Google, GitHub, etc.
- [ ] **Two-Factor Authentication** - Enhanced security option
- [ ] **Weather Maps** - Interactive weather radar and satellite maps
- [ ] **Historical Data** - Weather trends and historical comparisons
- [ ] **Weather Alerts** - Push notifications for severe weather
- [ ] **Multiple Locations** - Save and monitor multiple cities
- [ ] **Weather Charts** - Visual temperature and precipitation graphs
- [ ] **PWA Support** - Offline functionality and app-like experience
- [ ] **Voice Search** - Search cities using voice commands
- [ ] **Weather Widgets** - Embeddable weather widgets for other sites

---
DEMO LINK : https://weather-app-dun-gamma-77.vercel.app/
<div align="center">

**Star this repo if you found it helpful!**

**Found a bug? [Create an issue](https://github.com/yourusername/weather-dashboard/issues)**

**Have a feature request? [Start a discussion](https://github.com/yourusername/weather-dashboard/discussions)**

---

**Built with ❤️ using React.js and modern web technologies**

*Last updated: May 2025*

</div>
