import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Cloud, Sun, CloudRain } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
import { useAuth } from '../context/authcontext';
import styles from '../styles/App.module.css';

const LoginPage = () => {
  // Auth context
  const { signIn, signUp, authError, clearError, isLoading } = useAuth();
  
  // Component state
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear auth error when user starts typing
    if (authError) {
      clearError();
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    
    // Signup specific validations
    if (mode === 'signup') {
      if (!formData.displayName.trim()) {
        errors.displayName = 'Display name is required';
      } else if (formData.displayName.length < 2) {
        errors.displayName = 'Display name must be at least 2 characters long';
      }
      
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      let result;
      
      if (mode === 'login') {
        result = await signIn(formData.email.trim(), formData.password);
      } else {
        result = await signUp(
          formData.email.trim(), 
          formData.password, 
          formData.displayName.trim()
        );
      }
      
      if (result.success) {
        // Success - user will be automatically redirected by App.js
        console.log(`${mode} successful`);
        
        if (mode === 'signup') {
          // Show success message for signup
          alert('Account created successfully! Welcome to Weather Dashboard!');
        }
      } else {
        // Error handled by AuthContext
        console.error(`${mode} failed:`, result.error);
      }
    } catch (error) {
      console.error('Auth submission error:', error);
    }
  };

  // Toggle between login and signup
  const toggleMode = () => {
    const newMode = mode === 'login' ? 'signup' : 'login';
    setMode(newMode);
    setFormErrors({});
    clearError();
    
    // Reset form data when switching modes
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      displayName: ''
    });
    
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className={styles.loginPage}>
      {/* Background with animated weather icons */}
      <div className={styles.loginBackground}>
        <div className={styles.weatherIcon1}>
          <Sun size={60} />
        </div>
        <div className={styles.weatherIcon2}>
          <Cloud size={45} />
        </div>
        <div className={styles.weatherIcon3}>
          <CloudRain size={50} />
        </div>
        <div className={styles.weatherIcon4}>
          <Cloud size={35} />
        </div>
      </div>

      <div className={styles.loginContainer}>
        {/* Welcome Section */}
        <div className={styles.welcomeSection}>
          <div className={styles.logoSection}>
            <Sun size={48} className={styles.appLogo} />
            <h1 className={styles.appBrand}>Weather Dashboard</h1>
          </div>
          <p className={styles.welcomeText}>
            Get real-time weather information with personalized forecasts and beautiful visualizations
          </p>
          <div className={styles.features}>
            <div className={styles.feature}>✨ Real-time weather data</div>
            <div className={styles.feature}>📍 Location-based forecasts</div>
            <div className={styles.feature}>📊 5-day weather predictions</div>
            <div className={styles.feature}>🌡️ Temperature unit preferences</div>
          </div>
        </div>

        {/* Authentication Form */}
        <div className={styles.authSection}>
          <div className={styles.authCard}>
            {/* Auth Header */}
            <div className={styles.authHeader}>
              <h2 className={styles.authTitle}>
                {mode === 'login' ? 'Welcome Back!' : 'Join Weather Dashboard'}
              </h2>
              <p className={styles.authSubtitle}>
                {mode === 'login' 
                  ? 'Sign in to access your personalized weather dashboard' 
                  : 'Create your account to get started with personalized weather forecasts'
                }
              </p>
            </div>

            {/* Auth Error Display */}
            {authError && (
              <div className={styles.authError}>
                <span>{authError}</span>
                <button 
                  onClick={clearError}
                  className={styles.errorCloseBtn}
                  aria-label="Close error"
                >
                  ×
                </button>
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className={styles.authForm}>
              {/* Display Name (Signup only) */}
              {mode === 'signup' && (
                <div className={styles.formGroup}>
                  <label htmlFor="displayName" className={styles.formLabel}>
                    <User size={18} />
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className={`${styles.formInput} ${formErrors.displayName ? styles.formInputError : ''}`}
                    placeholder="Enter your full name"
                    disabled={isLoading}
                    autoComplete="name"
                  />
                  {formErrors.displayName && (
                    <span className={styles.formError}>{formErrors.displayName}</span>
                  )}
                </div>
              )}

              {/* Email Field */}
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.formLabel}>
                  <Mail size={18} />
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`${styles.formInput} ${formErrors.email ? styles.formInputError : ''}`}
                  placeholder="Enter your email address"
                  disabled={isLoading}
                  autoComplete="email"
                />
                {formErrors.email && (
                  <span className={styles.formError}>{formErrors.email}</span>
                )}
              </div>

              {/* Password Field */}
              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.formLabel}>
                  <Lock size={18} />
                  Password
                </label>
                <div className={styles.passwordInputWrapper}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`${styles.formInput} ${formErrors.password ? styles.formInputError : ''}`}
                    placeholder="Enter your password"
                    disabled={isLoading}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('password')}
                    className={styles.passwordToggle}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formErrors.password && (
                  <span className={styles.formError}>{formErrors.password}</span>
                )}
              </div>

              {/* Confirm Password (Signup only) */}
              {mode === 'signup' && (
                <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword" className={styles.formLabel}>
                    <Lock size={18} />
                    Confirm Password
                  </label>
                  <div className={styles.passwordInputWrapper}>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`${styles.formInput} ${formErrors.confirmPassword ? styles.formInputError : ''}`}
                      placeholder="Confirm your password"
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirmPassword')}
                      className={styles.passwordToggle}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {formErrors.confirmPassword && (
                    <span className={styles.formError}>{formErrors.confirmPassword}</span>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isLoading}
                className={styles.authSubmitButton}
              >
                {isLoading ? (
                  <>
                    <div className={styles.buttonSpinner} />
                    {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
                  </>
                ) : (
                  mode === 'login' ? 'Sign In to Dashboard' : 'Create Account & Start'
                )}
              </button>
            </form>

            {/* Mode Toggle */}
            <div className={styles.authToggle}>
              <span>
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              </span>
              <button 
                type="button"
                onClick={toggleMode}
                className={styles.authToggleButton}
                disabled={isLoading}
              >
                {mode === 'login' ? 'Create Account' : 'Sign In Instead'}
              </button>
            </div>

            {/* Demo Credentials (for testing) */}
            {mode === 'login' && (
              <div className={styles.demoCredentials}>
                <p>Demo Account:</p>
                <p>Email: demo@weather.com | Password: demo123</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;