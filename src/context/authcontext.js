import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, database } from '../config/supabase';

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Context Provider Component
export const AuthProvider = ({ children }) => {
  // Authentication state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  // User data state
  const [userPreferences, setUserPreferences] = useState(null);
  const [weatherHistory, setWeatherHistory] = useState([]);

  // Initialize auth state and listen for changes
  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { user }, error } = await auth.getCurrentUser();
        
        if (error) {
          console.error('Error getting initial session:', error);
          if (mounted) {
            setAuthError('Failed to load user session');
          }
        } else {
          if (mounted) {
            setUser(user);
            if (user) {
              await loadUserData(user.id);
            }
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          setAuthError('Failed to initialize authentication');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (mounted) {
        setUser(session?.user || null);
        setAuthError('');
        
        if (session?.user) {
          await loadUserData(session.user.id);
        } else {
          // Clear user data on logout
          setUserPreferences(null);
          setWeatherHistory([]);
        }
        
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Load user preferences and history
  const loadUserData = async (userId) => {
    try {
      // Load user preferences
      const { data: preferences, error: prefError } = await database.getUserPreferences(userId);
      if (prefError) {
        console.warn('Error loading user preferences:', prefError);
      } else {
        setUserPreferences(preferences);
      }

      // Load weather search history
      const { data: history, error: historyError } = await database.getWeatherHistory(userId, 10);
      if (historyError) {
        console.warn('Error loading weather history:', historyError);
      } else {
        setWeatherHistory(history || []);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Sign up function with improved error handling
  const signUp = async (email, password, displayName = '') => {
    setLoading(true);
    setAuthError('');
    
    try {
      console.log('Attempting signup for:', email);
      
      const { user, error } = await auth.signUp(email, password, {
        display_name: displayName
      });
      
      if (error) {
        console.error('Signup error:', error);
        
        // Handle specific error cases
        let errorMessage = error;
        if (error.includes('already registered') || error.includes('already exists')) {
          errorMessage = 'An account with this email already exists. Please sign in instead.';
        } else if (error.includes('invalid email')) {
          errorMessage = 'Please enter a valid email address.';
        } else if (error.includes('weak password') || error.includes('password')) {
          errorMessage = 'Password must be at least 6 characters long.';
        } else if (error.includes('signup disabled')) {
          errorMessage = 'Account creation is currently disabled. Please contact support.';
        }
        
        setAuthError(errorMessage);
        return { success: false, error: errorMessage };
      }
      
      console.log('Signup successful:', user?.id);
      
      // Create initial user preferences
      if (user?.id) {
        try {
          await database.saveUserPreferences(user.id, {
            unit: 'celsius',
            defaultCity: ''
          });
        } catch (prefError) {
          console.warn('Failed to create initial preferences:', prefError);
          // Don't fail signup for this
        }
      }
      
      return { success: true, user };
    } catch (error) {
      console.error('Signup exception:', error);
      const errorMessage = 'Sign up failed. Please try again.';
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Sign in function with improved error handling
  const signIn = async (email, password) => {
    setLoading(true);
    setAuthError('');
    
    try {
      console.log('Attempting signin for:', email);
      
      const { user, error } = await auth.signIn(email, password);
      
      if (error) {
        console.error('Signin error:', error);
        
        // Handle specific error cases
        let errorMessage = error;
        if (error.includes('invalid login') || error.includes('invalid credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.includes('email not confirmed')) {
          errorMessage = 'Please check your email and click the confirmation link before signing in.';
        } else if (error.includes('too many requests')) {
          errorMessage = 'Too many login attempts. Please wait a few minutes and try again.';
        } else if (error.includes('user not found')) {
          errorMessage = 'No account found with this email. Please sign up first.';
        }
        
        setAuthError(errorMessage);
        return { success: false, error: errorMessage };
      }
      
      console.log('Signin successful:', user?.id);
      return { success: true, user };
    } catch (error) {
      console.error('Signin exception:', error);
      const errorMessage = 'Sign in failed. Please check your connection and try again.';
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    setLoading(true);
    setAuthError('');
    
    try {
      console.log('Signing out user');
      
      const { error } = await auth.signOut();
      
      if (error) {
        console.error('Signout error:', error);
        setAuthError('Sign out failed. Please try again.');
        return { success: false, error: error };
      }
      
      // Clear local state immediately
      setUser(null);
      setUserPreferences(null);
      setWeatherHistory([]);
      
      console.log('Signout successful');
      return { success: true };
    } catch (error) {
      console.error('Signout exception:', error);
      const errorMessage = 'Sign out failed. Please try again.';
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Save weather search to user's history
  const saveWeatherSearch = async (weatherData) => {
    if (!user) return;
    
    try {
      const { error } = await database.saveWeatherSearch(user.id, weatherData);
      
      if (!error) {
        // Update local history
        const newSearch = {
          user_id: user.id,
          city: weatherData.city,
          country: weatherData.country,
          temperature: weatherData.temperature,
          condition: weatherData.condition,
          searched_at: new Date().toISOString()
        };
        
        setWeatherHistory(prev => [
          newSearch,
          ...prev.slice(0, 9) // Keep only latest 10
        ]);
      }
    } catch (error) {
      console.error('Error saving weather search:', error);
    }
  };

  // Save user preferences
  const savePreferences = async (preferences) => {
    if (!user) return;
    
    try {
      const { error } = await database.saveUserPreferences(user.id, preferences);
      
      if (!error) {
        setUserPreferences(prev => ({
          ...prev,
          temperature_unit: preferences.unit,
          default_city: preferences.defaultCity,
          updated_at: new Date().toISOString()
        }));
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  // Clear auth error
  const clearError = () => {
    setAuthError('');
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return '';
    
    // Try different sources for display name
    return user.user_metadata?.display_name || 
           user.user_metadata?.full_name ||
           user.email?.split('@')[0] || 
           'User';
  };

  // Check if user has completed profile
  const isProfileComplete = () => {
    if (!user) return false;
    return !!(user.user_metadata?.display_name || user.user_metadata?.full_name);
  };

  // Auth context value
  const value = {
    // Auth state
    user,
    loading,
    authError,
    
    // User data
    userPreferences,
    weatherHistory,
    
    // Auth functions
    signUp,
    signIn,
    signOut,
    clearError,
    
    // User functions
    saveWeatherSearch,
    savePreferences,
    getUserDisplayName,
    isProfileComplete,
    
    // Helper properties
    isAuthenticated: !!user,
    isLoading: loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};