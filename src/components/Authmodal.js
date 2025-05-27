import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
import { useAuth } from '../context/authcontext';
import styles from '../styles/App.module.css';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  // Auth context
  const { signIn, signUp, authError, clearError, isLoading } = useAuth();
  
  // Component state
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        displayName: ''
      });
      setFormErrors({});
      clearError();
    }
  }, [isOpen, mode, clearError]);

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
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    // Signup specific validations
    if (mode === 'signup') {
      if (!formData.displayName.trim()) {
        errors.displayName = 'Display name is required';
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
        result = await signIn(formData.email, formData.password);
      } else {
        result = await signUp(formData.email, formData.password, formData.displayName);
      }
      
      if (result.success) {
        onClose();
        
        // Show success message for signup
        if (mode === 'signup') {
          alert('Account created successfully! Please check your email to verify your account.');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  // Toggle between login and signup
  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setFormErrors({});
    clearError();
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.authModal} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <button 
            onClick={onClose}
            className={styles.modalCloseButton}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className={styles.modalContent}>
          <p className={styles.modalSubtitle}>
            {mode === 'login' 
              ? 'Sign in to save your weather preferences' 
              : 'Join us to personalize your weather experience'
            }
          </p>

          {/* Auth Error Display */}
          {authError && (
            <div className={styles.authError}>
              <span>{authError}</span>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className={styles.authForm}>
            {/* Display Name (Signup only) */}
            {mode === 'signup' && (
              <div className={styles.formGroup}>
                <label htmlFor="displayName" className={styles.formLabel}>
                  <User size={16} />
                  Display Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className={`${styles.formInput} ${formErrors.displayName ? styles.formInputError : ''}`}
                  placeholder="Your display name"
                  disabled={isLoading}
                />
                {formErrors.displayName && (
                  <span className={styles.formError}>{formErrors.displayName}</span>
                )}
              </div>
            )}

            {/* Email Field */}
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>
                <Mail size={16} />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`${styles.formInput} ${formErrors.email ? styles.formInputError : ''}`}
                placeholder="your@email.com"
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
                <Lock size={16} />
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
                  onClick={togglePasswordVisibility}
                  className={styles.passwordToggle}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
                  <Lock size={16} />
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`${styles.formInput} ${formErrors.confirmPassword ? styles.formInputError : ''}`}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                  autoComplete="new-password"
                />
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
                <div className={styles.buttonSpinner} />
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
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
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;