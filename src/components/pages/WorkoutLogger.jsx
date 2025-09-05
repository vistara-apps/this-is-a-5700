import React, { useState } from 'react'
import { useFitness } from '../../contexts/FitnessContext'
import { Plus, Play, Square, Timer } from 'lucide-react'

export default function WorkoutLogger() {
  const { 
    currentWorkout, 
    exerciseLibrary, 
    loading, 
    startWorkout, 
    finishWorkout, 
    addExercise: addExerciseToWorkout 
  } = useFitness()
  
  const [selectedExercise, setSelectedExercise] = useState('')
  const [sets, setSets] = useState('')
  const [reps, setReps] = useState('')
  const [weight, setWeight] = useState('')

  const handleStartWorkout = async () => {
    const result = await startWorkout()
    if (!result.success) {
      console.error('Failed to start workout:', result.error)
    }
  }

  const handleFinishWorkout = async () => {
    const result = await finishWorkout()
    if (!result.success) {
      console.error('Failed to finish workout:', result.error)
    }
  }

  const handleAddExercise = async () => {
    if (!selectedExercise || !sets || !reps || !weight) return

    const exercise = {
      exercise_name: selectedExercise,
      sets: parseInt(sets),
      reps: Array(parseInt(sets)).fill(parseInt(reps)),
      weight: Array(parseInt(sets)).fill(parseFloat(weight)),
      rest_time: 120
    }

    const result = await addExerciseToWorkout(exercise)
    
    if (result.success) {
      // Reset form
      setSelectedExercise('')
      setSets('')
      setReps('')
      setWeight('')
    }
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
              onClick={handleStartWorkout}
              disabled={loading}
              className="btn-primary inline-flex items-center space-x-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              <span>{loading ? 'Starting...' : 'Start Workout'}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Workout Header */}
            <div className="flex items-center justify-between p-4 bg-accent/10 rounded-lg">
              <div>
                <h3 className="font-medium text-text">Workout in Progress</h3>
                <p className="text-sm text-muted">
                  Duration: {formatDuration(currentWorkout.start_time)}
                </p>
              </div>
              <button 
                onClick={handleFinishWorkout}
                disabled={loading}
                className="btn-secondary inline-flex items-center space-x-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
                <span>{loading ? 'Finishing...' : 'Finish'}</span>
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
                    {exerciseLibrary.map((exercise) => (
                      <option key={exercise.id} value={exercise.name}>{exercise.name}</option>
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
                onClick={handleAddExercise}
                className="btn-primary mt-4 inline-flex items-center space-x-2"
                disabled={!selectedExercise || !sets || !reps || !weight || loading}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                <span>{loading ? 'Adding...' : 'Add Exercise'}</span>
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
                        <h5 className="font-medium text-text">{exercise.exercise_name}</h5>
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
