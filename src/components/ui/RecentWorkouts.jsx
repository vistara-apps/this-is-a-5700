import React from 'react'
import { Clock, Calendar } from 'lucide-react'
import { format } from 'date-fns'

export default function RecentWorkouts({ workouts }) {
  if (!workouts || workouts.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-medium text-text mb-4">Recent Workouts</h3>
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-muted mx-auto mb-3" />
          <p className="text-muted">No workouts logged yet</p>
          <p className="text-sm text-muted">Start your first workout to see it here!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-medium text-text mb-4">Recent Workouts</h3>
      <div className="space-y-3">
        {workouts.map((workout) => (
          <div key={workout.workoutId} className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <Calendar className="h-4 w-4 text-muted" />
                <span className="text-sm font-medium text-text">
                  {format(new Date(workout.startTime), 'MMM d, yyyy')}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{workout.duration}m</span>
                </div>
                <span>{workout.exercises?.length || 0} exercises</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-text">
                {workout.exercises?.map(ex => ex.exerciseName).join(', ').substring(0, 30)}
                {workout.exercises?.map(ex => ex.exerciseName).join(', ').length > 30 && '...'}
              </div>
              <div className="text-xs text-muted">
                {format(new Date(workout.startTime), 'h:mm a')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}