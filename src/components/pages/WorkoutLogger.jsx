import React, { useState } from 'react'
import { useFitness } from '../../contexts/FitnessContext'
import { Plus, Play, Square, Timer } from 'lucide-react'

const commonExercises = [
  'Bench Press', 'Squats', 'Deadlifts', 'Overhead Press', 'Barbell Rows',
  'Pull-ups', 'Dips', 'Bicep Curls', 'Tricep Extensions', 'Leg Press'
]

export default function WorkoutLogger() {
  const { state, dispatch } = useFitness()
  const { currentWorkout } = state
  const [selectedExercise, setSelectedExercise] = useState('')
  const [sets, setSets] = useState('')
  const [reps, setReps] = useState('')
  const [weight, setWeight] = useState('')

  const startWorkout = () => {
    dispatch({ type: 'START_WORKOUT' })
  }

  const finishWorkout = () => {
    dispatch({ type: 'FINISH_WORKOUT' })
  }

  const addExercise = () => {
    if (!selectedExercise || !sets || !reps || !weight) return

    const exercise = {
      exerciseId: Date.now().toString(),
      exerciseName: selectedExercise,
      sets: parseInt(sets),
      reps: Array(parseInt(sets)).fill(parseInt(reps)),
      weight: Array(parseInt(sets)).fill(parseFloat(weight)),
      restTime: 120,
      createdAt: new Date().toISOString()
    }

    dispatch({ type: 'ADD_EXERCISE', payload: exercise })
    
    // Reset form
    setSelectedExercise('')
    setSets('')
    setReps('')
    setWeight('')
  }

  const formatDuration = (startTime) => {
    const duration = Math.floor((new Date() - new Date(startTime)) / 1000 / 60)
    return `${duration}m`
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="card">
        <h2 className="text-2xl font-semibold text-text mb-4">Workout Logger</h2>
        
        {!currentWorkout ? (
          <div className="text-center py-8">
            <Timer className="h-16 w-16 text-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text mb-2">Ready to start your workout?</h3>
            <p className="text-muted mb-6">Track your exercises in real-time and get AI insights.</p>
            <button 
              onClick={startWorkout}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Play className="h-4 w-4" />
              <span>Start Workout</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Workout Header */}
            <div className="flex items-center justify-between p-4 bg-accent/10 rounded-lg">
              <div>
                <h3 className="font-medium text-text">Workout in Progress</h3>
                <p className="text-sm text-muted">
                  Duration: {formatDuration(currentWorkout.startTime)}
                </p>
              </div>
              <button 
                onClick={finishWorkout}
                className="btn-secondary inline-flex items-center space-x-2"
              >
                <Square className="h-4 w-4" />
                <span>Finish</span>
              </button>
            </div>

            {/* Add Exercise Form */}
            <div className="card bg-gray-50">
              <h4 className="font-medium text-text mb-4">Add Exercise</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Exercise</label>
                  <select 
                    value={selectedExercise}
                    onChange={(e) => setSelectedExercise(e.target.value)}
                    className="input w-full"
                  >
                    <option value="">Select exercise...</option>
                    {commonExercises.map((exercise) => (
                      <option key={exercise} value={exercise}>{exercise}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Sets</label>
                  <input
                    type="number"
                    value={sets}
                    onChange={(e) => setSets(e.target.value)}
                    className="input w-full"
                    placeholder="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Reps</label>
                  <input
                    type="number"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    className="input w-full"
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Weight (lbs)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="input w-full"
                    placeholder="135"
                  />
                </div>
              </div>
              <button 
                onClick={addExercise}
                className="btn-primary mt-4 inline-flex items-center space-x-2"
                disabled={!selectedExercise || !sets || !reps || !weight}
              >
                <Plus className="h-4 w-4" />
                <span>Add Exercise</span>
              </button>
            </div>

            {/* Current Workout Exercises */}
            {currentWorkout.exercises.length > 0 && (
              <div className="card">
                <h4 className="font-medium text-text mb-4">Today's Exercises</h4>
                <div className="space-y-3">
                  {currentWorkout.exercises.map((exercise, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div>
                        <h5 className="font-medium text-text">{exercise.exerciseName}</h5>
                        <p className="text-sm text-muted">
                          {exercise.sets} sets × {exercise.reps[0]} reps @ {exercise.weight[0]} lbs
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}