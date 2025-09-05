import React, { createContext, useContext, useReducer, useEffect } from 'react'

const FitnessContext = createContext()

// Sample data for demonstration
const initialState = {
  user: {
    userId: '1',
    email: 'user@example.com',
    subscriptionTier: 'pro',
    createdAt: new Date().toISOString(),
  },
  workouts: [
    {
      workoutId: '1',
      userId: '1',
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
      duration: 60,
      exercises: [
        {
          exerciseId: '1',
          exerciseName: 'Bench Press',
          sets: 3,
          reps: [10, 8, 6],
          weight: [135, 145, 155],
          restTime: 120,
        },
        {
          exerciseId: '2',
          exerciseName: 'Squats',
          sets: 3,
          reps: [12, 10, 8],
          weight: [185, 205, 225],
          restTime: 180,
        }
      ]
    },
    {
      workoutId: '2',
      userId: '1',
      startTime: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() - 47 * 60 * 60 * 1000).toISOString(),
      duration: 45,
      exercises: [
        {
          exerciseId: '3',
          exerciseName: 'Deadlifts',
          sets: 3,
          reps: [8, 6, 4],
          weight: [225, 245, 265],
          restTime: 240,
        }
      ]
    }
  ],
  currentWorkout: null,
  aiRecommendations: []
}

function fitnessReducer(state, action) {
  switch (action.type) {
    case 'START_WORKOUT':
      return {
        ...state,
        currentWorkout: {
          workoutId: Date.now().toString(),
          userId: state.user.userId,
          startTime: new Date().toISOString(),
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
    
    case 'FINISH_WORKOUT':
      if (!state.currentWorkout) return state
      const finishedWorkout = {
        ...state.currentWorkout,
        endTime: new Date().toISOString(),
        duration: Math.round((new Date() - new Date(state.currentWorkout.startTime)) / (1000 * 60))
      }
      return {
        ...state,
        workouts: [finishedWorkout, ...state.workouts],
        currentWorkout: null
      }
    
    case 'SET_AI_RECOMMENDATIONS':
      return {
        ...state,
        aiRecommendations: action.payload
      }
    
    default:
      return state
  }
}

export function FitnessProvider({ children }) {
  const [state, dispatch] = useReducer(fitnessReducer, initialState)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('fitflow-data')
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        // You would dispatch actions to restore state here
      } catch (error) {
        console.error('Error loading saved data:', error)
      }
    }
  }, [])

  // Save data to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('fitflow-data', JSON.stringify(state))
  }, [state])

  return (
    <FitnessContext.Provider value={{ state, dispatch }}>
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