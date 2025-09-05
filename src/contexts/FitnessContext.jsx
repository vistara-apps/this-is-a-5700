import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { useWorkouts } from '../hooks/useWorkouts'
import { db } from '../lib/supabase'
import { openaiService } from '../lib/openai'
import toast from 'react-hot-toast'

const FitnessContext = createContext()

const initialState = {
  currentWorkout: null,
  aiRecommendations: [],
  exerciseLibrary: [],
  personalRecords: [],
  loading: false
}

function fitnessReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }
    
    case 'START_WORKOUT':
      return {
        ...state,
        currentWorkout: {
          id: null, // Will be set when saved to DB
          start_time: new Date().toISOString(),
          exercises: []
        }
      }
    
    case 'ADD_EXERCISE':
      if (!state.currentWorkout) return state
      return {
        ...state,
        currentWorkout: {
          ...state.currentWorkout,
          exercises: [...state.currentWorkout.exercises, action.payload]
        }
      }
    
    case 'UPDATE_CURRENT_WORKOUT':
      return {
        ...state,
        currentWorkout: action.payload
      }
    
    case 'FINISH_WORKOUT':
      return {
        ...state,
        currentWorkout: null
      }
    
    case 'SET_AI_RECOMMENDATIONS':
      return {
        ...state,
        aiRecommendations: action.payload
      }
    
    case 'SET_EXERCISE_LIBRARY':
      return {
        ...state,
        exerciseLibrary: action.payload
      }
    
    case 'SET_PERSONAL_RECORDS':
      return {
        ...state,
        personalRecords: action.payload
      }
    
    default:
      return state
  }
}

export function FitnessProvider({ children }) {
  const [state, dispatch] = useReducer(fitnessReducer, initialState)
  const { user } = useAuth()
  const workoutHook = useWorkouts()

  // Load exercise library
  const loadExerciseLibrary = async () => {
    try {
      const { data, error } = await db.getExerciseLibrary()
      if (error) throw error
      dispatch({ type: 'SET_EXERCISE_LIBRARY', payload: data || [] })
    } catch (error) {
      console.error('Error loading exercise library:', error)
      toast.error('Failed to load exercise library')
    }
  }

  // Load personal records
  const loadPersonalRecords = async () => {
    if (!user) return
    try {
      const { data, error } = await db.getPersonalRecords(user.id)
      if (error) throw error
      dispatch({ type: 'SET_PERSONAL_RECORDS', payload: data || [] })
    } catch (error) {
      console.error('Error loading personal records:', error)
      toast.error('Failed to load personal records')
    }
  }

  // Load AI recommendations
  const loadRecommendations = async () => {
    if (!user) return
    try {
      const { data, error } = await db.getRecommendations(user.id)
      if (error) throw error
      dispatch({ type: 'SET_AI_RECOMMENDATIONS', payload: data || [] })
    } catch (error) {
      console.error('Error loading recommendations:', error)
      toast.error('Failed to load recommendations')
    }
  }

  // Start workout
  const startWorkout = async () => {
    if (!user) return { success: false, error: 'No user logged in' }
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const workoutData = {
        user_id: user.id,
        start_time: new Date().toISOString()
      }
      
      const result = await workoutHook.createWorkout(workoutData)
      
      if (result.success) {
        dispatch({ 
          type: 'UPDATE_CURRENT_WORKOUT', 
          payload: { ...result.data, exercises: [] }
        })
      }
      
      return result
    } catch (error) {
      console.error('Error starting workout:', error)
      return { success: false, error: error.message }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Finish workout
  const finishWorkout = async () => {
    if (!state.currentWorkout) return { success: false, error: 'No active workout' }
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const endTime = new Date().toISOString()
      const duration = Math.round(
        (new Date(endTime) - new Date(state.currentWorkout.start_time)) / (1000 * 60)
      )
      
      const result = await workoutHook.updateWorkout(state.currentWorkout.id, {
        end_time: endTime,
        duration
      })
      
      if (result.success) {
        dispatch({ type: 'FINISH_WORKOUT' })
        // Refresh workouts list
        workoutHook.refetch()
      }
      
      return result
    } catch (error) {
      console.error('Error finishing workout:', error)
      return { success: false, error: error.message }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Add exercise to current workout
  const addExercise = async (exerciseData) => {
    if (!state.currentWorkout) return { success: false, error: 'No active workout' }
    
    try {
      const result = await workoutHook.addExerciseToWorkout(
        state.currentWorkout.id, 
        exerciseData
      )
      
      if (result.success) {
        dispatch({ type: 'ADD_EXERCISE', payload: result.data })
      }
      
      return result
    } catch (error) {
      console.error('Error adding exercise:', error)
      return { success: false, error: error.message }
    }
  }

  // Generate AI recommendations
  const generateAIRecommendations = async () => {
    if (!user || workoutHook.workouts.length === 0) return
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const result = await openaiService.generateRecommendations(
        workoutHook.workouts,
        state.personalRecords,
        { weight_unit: 'lbs' } // TODO: Get from user preferences
      )
      
      if (result.success) {
        // Save recommendations to database
        const savedRecommendations = []
        for (const rec of result.recommendations) {
          const { data, error } = await db.createRecommendation({
            user_id: user.id,
            type: rec.type,
            priority: rec.priority,
            title: rec.title,
            description: rec.description
          })
          
          if (!error && data) {
            savedRecommendations.push(data)
          }
        }
        
        dispatch({ type: 'SET_AI_RECOMMENDATIONS', payload: savedRecommendations })
        toast.success('AI recommendations generated!')
      } else {
        toast.error('Failed to generate AI recommendations')
      }
    } catch (error) {
      console.error('Error generating AI recommendations:', error)
      toast.error('Failed to generate AI recommendations')
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Load data when user changes
  useEffect(() => {
    if (user) {
      loadExerciseLibrary()
      loadPersonalRecords()
      loadRecommendations()
    }
  }, [user])

  // Generate AI recommendations when workouts change (debounced)
  useEffect(() => {
    if (user && workoutHook.workouts.length > 0) {
      const timer = setTimeout(() => {
        // Only generate if we don't have recent recommendations
        const hasRecentRecommendations = state.aiRecommendations.some(rec => {
          const recDate = new Date(rec.created_at)
          const daysSince = (Date.now() - recDate.getTime()) / (1000 * 60 * 60 * 24)
          return daysSince < 7 // Less than 7 days old
        })
        
        if (!hasRecentRecommendations) {
          generateAIRecommendations()
        }
      }, 2000) // 2 second delay
      
      return () => clearTimeout(timer)
    }
  }, [workoutHook.workouts.length, user])

  const value = {
    ...state,
    workouts: workoutHook.workouts,
    workoutsLoading: workoutHook.loading,
    workoutsError: workoutHook.error,
    startWorkout,
    finishWorkout,
    addExercise,
    generateAIRecommendations,
    refetchWorkouts: workoutHook.refetch,
    dispatch
  }

  return (
    <FitnessContext.Provider value={value}>
      {children}
    </FitnessContext.Provider>
  )
}

export function useFitness() {
  const context = useContext(FitnessContext)
  if (!context) {
    throw new Error('useFitness must be used within a FitnessProvider')
  }
  return context
}
