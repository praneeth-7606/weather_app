import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Check if Supabase is configured
const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn('⚠️ Supabase is not configured. Please add REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY to your .env file.');
  console.log('📚 Check SUPABASE_SETUP.md for setup instructions.');
}

// Create Supabase client (will be null if not configured)
export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Auth helper functions
export const auth = {
  // Sign up with email and password
  signUp: async (email, password, userData = {}) => {
    if (!supabase) {
      return { user: null, error: 'Supabase is not configured. Please check your environment variables.' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      if (error) throw error;
      return { user: data.user, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { user: null, error: error.message };
    }
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    if (!supabase) {
      return { user: null, error: 'Supabase is not configured. Please check your environment variables.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return { user: data.user, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { user: null, error: error.message };
    }
  },

  // Sign out
  signOut: async () => {
    if (!supabase) {
      return { error: 'Supabase is not configured.' };
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: error.message };
    }
  },

  // Get current user
  getCurrentUser: () => {
    if (!supabase) {
      return Promise.resolve({ data: { user: null }, error: 'Supabase is not configured.' });
    }
    return supabase.auth.getUser();
  },

  // Listen to auth changes
  onAuthStateChange: (callback) => {
    if (!supabase) {
      // Return a mock subscription that does nothing
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    }
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database helper functions for weather data
export const database = {
  // Save user's weather search history
  saveWeatherSearch: async (userId, weatherData) => {
    if (!supabase) {
      console.warn('Supabase not configured - weather search not saved');
      return { data: null, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('weather_searches')
        .insert([
          {
            user_id: userId,
            city: weatherData.city,
            country: weatherData.country,
            temperature: weatherData.temperature,
            condition: weatherData.condition,
            searched_at: new Date().toISOString()
          }
        ]);
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Save weather search error:', error);
      return { data: null, error: error.message };
    }
  },

  // Get user's weather search history
  getWeatherHistory: async (userId, limit = 10) => {
    if (!supabase) {
      console.warn('Supabase not configured - returning empty history');
      return { data: [], error: null };
    }

    try {
      const { data, error } = await supabase
        .from('weather_searches')
        .select('*')
        .eq('user_id', userId)
        .order('searched_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get weather history error:', error);
      return { data: [], error: error.message };
    }
  },

  // Save user preferences
  saveUserPreferences: async (userId, preferences) => {
    if (!supabase) {
      console.warn('Supabase not configured - preferences not saved');
      return { data: null, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert([
          {
            user_id: userId,
            temperature_unit: preferences.unit,
            default_city: preferences.defaultCity,
            updated_at: new Date().toISOString()
          }
        ]);
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Save preferences error:', error);
      return { data: null, error: error.message };
    }
  },

  // Get user preferences
  getUserPreferences: async (userId) => {
    if (!supabase) {
      console.warn('Supabase not configured - returning default preferences');
      return { data: null, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return { data: data || null, error: null };
    } catch (error) {
      console.error('Get preferences error:', error);
      return { data: null, error: error.message };
    }
  }
};

// Export configuration status
export const isConfigured = isSupabaseConfigured;