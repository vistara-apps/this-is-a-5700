import React, { useState } from 'react'
import { useFitness } from '../../contexts/FitnessContext'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Calendar, TrendingUp, Target } from 'lucide-react'

export default function Progress() {
  const { state } = useFitness()
  const { workouts } = state
  const [timeRange, setTimeRange] = useState('7d')

  // Prepare workout frequency data
  const workoutFrequencyData = workouts.slice(0, 7).reverse().map((workout, index) => ({
    day: new Date(workout.startTime).toLocaleDateString('en-US', { weekday: 'short' }),
    duration: workout.duration,
    date: workout.startTime
  }))

  // Prepare strength progress data (simulated)
  const strengthData = [
    { exercise: 'Bench Press', current: 155, target: 175, progress: 88 },
    { exercise: 'Squats', current: 225, target: 250, progress: 90 },
    { exercise: 'Deadlifts', current: 265, target: 300, progress: 88 },
    { exercise: 'Overhead Press', current: 95, target: 115, progress: 83 }
  ]

  // Calculate weekly stats
  const thisWeekMinutes = workouts
    .filter(w => {
      const date = new Date(w.startTime)
      const now = new Date()
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
      return date >= weekStart
    })
    .reduce((sum, w) => sum + w.duration, 0)

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-text">Progress Analytics</h2>
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
          </select>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card bg-primary/5 border border-primary/10">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-md">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted">This Week</p>
                <p className="text-xl font-semibold text-text">{thisWeekMinutes}m</p>
              </div>
            </div>
          </div>
          <div className="card bg-accent/5 border border-accent/10">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-accent/10 rounded-md">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted">Avg Session</p>
                <p className="text-xl font-semibold text-text">52m</p>
              </div>
            </div>
          </div>
          <div className="card bg-orange-50 border border-orange-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-md">
                <Target className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted">Weekly Goal</p>
                <p className="text-xl font-semibold text-text">4/5</p>
              </div>
            </div>
          </div>
        </div>

        {/* Workout Frequency Chart */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-text mb-4">Workout Duration (Minutes)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workoutFrequencyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="duration" fill="hsl(210, 80%, 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strength Progress */}
        <div>
          <h3 className="text-lg font-medium text-text mb-4">Strength Progress</h3>
          <div className="space-y-4">
            {strengthData.map((item, index) => (
              <div key={index} className="card bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-text">{item.exercise}</h4>
                  <span className="text-sm text-muted">{item.current} / {item.target} lbs</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-accent h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted mt-1">{item.progress}% to goal</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}