import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Auth helpers
export const auth = {
  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  resetPassword: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { data, error }
  },

  updatePassword: async (password) => {
    const { data, error } = await supabase.auth.updateUser({
      password: password
    })
    return { data, error }
  },

  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  }
}

// Database helpers
export const db = {
  // Users
  getUser: async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  updateUser: async (userId, updates) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  },

  // Workouts
  getWorkouts: async (userId, limit = 50) => {
    const { data, error } = await supabase
      .from('workouts')
      .select(`
        *,
        exercises (*)
      `)
      .eq('user_id', userId)
      .order('start_time', { ascending: false })
      .limit(limit)
    return { data, error }
  },

  createWorkout: async (workout) => {
    const { data, error } = await supabase
      .from('workouts')
      .insert(workout)
      .select()
      .single()
    return { data, error }
  },

  updateWorkout: async (workoutId, updates) => {
    const { data, error } = await supabase
      .from('workouts')
      .update(updates)
      .eq('id', workoutId)
      .select()
      .single()
    return { data, error }
  },

  deleteWorkout: async (workoutId) => {
    const { error } = await supabase
      .from('workouts')
      .delete()
      .eq('id', workoutId)
    return { error }
  },

  // Exercises
  createExercise: async (exercise) => {
    const { data, error } = await supabase
      .from('exercises')
      .insert(exercise)
      .select()
      .single()
    return { data, error }
  },

  updateExercise: async (exerciseId, updates) => {
    const { data, error } = await supabase
      .from('exercises')
      .update(updates)
      .eq('id', exerciseId)
      .select()
      .single()
    return { data, error }
  },

  deleteExercise: async (exerciseId) => {
    const { error } = await supabase
      .from('exercises')
      .delete()
      .eq('id', exerciseId)
    return { error }
  },

  // Exercise Library
  getExerciseLibrary: async () => {
    const { data, error } = await supabase
      .from('exercise_library')
      .select('*')
      .order('name')
    return { data, error }
  },

  // Personal Records
  getPersonalRecords: async (userId) => {
    const { data, error } = await supabase
      .from('personal_records')
      .select('*')
      .eq('user_id', userId)
      .order('date_achieved', { ascending: false })
    return { data, error }
  },

  createPersonalRecord: async (record) => {
    const { data, error } = await supabase
      .from('personal_records')
      .insert(record)
      .select()
      .single()
    return { data, error }
  },

  // AI Recommendations
  getRecommendations: async (userId) => {
    const { data, error } = await supabase
      .from('ai_recommendations')
      .select('*')
      .eq('user_id', userId)
      .eq('is_dismissed', false)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  createRecommendation: async (recommendation) => {
    const { data, error } = await supabase
      .from('ai_recommendations')
      .insert(recommendation)
      .select()
      .single()
    return { data, error }
  },

  updateRecommendation: async (recommendationId, updates) => {
    const { data, error } = await supabase
      .from('ai_recommendations')
      .update(updates)
      .eq('id', recommendationId)
      .select()
      .single()
    return { data, error }
  },

  // User Preferences
  getUserPreferences: async (userId) => {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()
    return { data, error }
  },

  updateUserPreferences: async (userId, preferences) => {
    const { data, error } = await supabase
      .from('user_preferences')
      .update(preferences)
      .eq('user_id', userId)
      .select()
      .single()
    return { data, error }
  },

  // Workout Templates
  getWorkoutTemplates: async (userId) => {
    const { data, error } = await supabase
      .from('workout_templates')
      .select('*')
      .or(`user_id.eq.${userId},is_public.eq.true`)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  createWorkoutTemplate: async (template) => {
    const { data, error } = await supabase
      .from('workout_templates')
      .insert(template)
      .select()
      .single()
    return { data, error }
  }
}

export default supabase
