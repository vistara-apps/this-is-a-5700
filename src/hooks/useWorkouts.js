import { useState, useEffect } from 'react'
import { db } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export function useWorkouts() {
  const { user } = useAuth()
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load workouts
  const loadWorkouts = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)
      const { data, error } = await db.getWorkouts(user.id)
      
      if (error) {
        throw error
      }
      
      setWorkouts(data || [])
    } catch (err) {
      console.error('Error loading workouts:', err)
      setError(err.message)
      toast.error('Failed to load workouts')
    } finally {
      setLoading(false)
    }
  }

  // Create workout
  const createWorkout = async (workoutData) => {
    if (!user) return { success: false, error: 'No user logged in' }

    try {
      const { data, error } = await db.createWorkout({
        ...workoutData,
        user_id: user.id
      })
      
      if (error) {
        throw error
      }
      
      setWorkouts(prev => [data, ...prev])
      toast.success('Workout created successfully')
      return { success: true, data }
    } catch (err) {
      console.error('Error creating workout:', err)
      toast.error('Failed to create workout')
      return { success: false, error: err.message }
    }
  }

  // Update workout
  const updateWorkout = async (workoutId, updates) => {
    try {
      const { data, error } = await db.updateWorkout(workoutId, updates)
      
      if (error) {
        throw error
      }
      
      setWorkouts(prev => 
        prev.map(workout => 
          workout.id === workoutId ? data : workout
        )
      )
      toast.success('Workout updated successfully')
      return { success: true, data }
    } catch (err) {
      console.error('Error updating workout:', err)
      toast.error('Failed to update workout')
      return { success: false, error: err.message }
    }
  }

  // Delete workout
  const deleteWorkout = async (workoutId) => {
    try {
      const { error } = await db.deleteWorkout(workoutId)
      
      if (error) {
        throw error
      }
      
      setWorkouts(prev => prev.filter(workout => workout.id !== workoutId))
      toast.success('Workout deleted successfully')
      return { success: true }
    } catch (err) {
      console.error('Error deleting workout:', err)
      toast.error('Failed to delete workout')
      return { success: false, error: err.message }
    }
  }

  // Add exercise to workout
  const addExerciseToWorkout = async (workoutId, exerciseData) => {
    try {
      const { data, error } = await db.createExercise({
        ...exerciseData,
        workout_id: workoutId
      })
      
      if (error) {
        throw error
      }
      
      // Update the workout in state to include the new exercise
      setWorkouts(prev => 
        prev.map(workout => 
          workout.id === workoutId 
            ? { ...workout, exercises: [...(workout.exercises || []), data] }
            : workout
        )
      )
      
      toast.success('Exercise added successfully')
      return { success: true, data }
    } catch (err) {
      console.error('Error adding exercise:', err)
      toast.error('Failed to add exercise')
      return { success: false, error: err.message }
    }
  }

  // Load workouts when user changes
  useEffect(() => {
    if (user) {
      loadWorkouts()
    } else {
      setWorkouts([])
      setLoading(false)
    }
  }, [user])

  return {
    workouts,
    loading,
    error,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    addExerciseToWorkout,
    refetch: loadWorkouts
  }
}
