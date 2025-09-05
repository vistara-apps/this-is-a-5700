import React from 'react'
import { useFitness } from '../../contexts/FitnessContext'
import StatsCard from '../ui/StatsCard'
import QuickActions from '../ui/QuickActions'
import RecentWorkouts from '../ui/RecentWorkouts'
import { Calendar, Clock, Trophy, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  const { state } = useFitness()
  const { workouts, user } = state

  // Calculate stats
  const totalWorkouts = workouts.length
  const totalMinutes = workouts.reduce((sum, workout) => sum + workout.duration, 0)
  const avgDuration = totalWorkouts > 0 ? Math.round(totalMinutes / totalWorkouts) : 0
  const thisWeekWorkouts = workouts.filter(workout => {
    const workoutDate = new Date(workout.startTime)
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    return workoutDate >= weekAgo
  }).length

  const stats = [
    {
      title: 'Total Workouts',
      value: totalWorkouts,
      icon: Calendar,
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'This Week',
      value: thisWeekWorkouts,
      icon: TrendingUp,
      trend: '+2',
      trendUp: true
    },
    {
      title: 'Avg Duration',
      value: `${avgDuration}m`,
      icon: Clock,
      trend: '+5m',
      trendUp: true
    },
    {
      title: 'Personal Bests',
      value: 8,
      icon: Trophy,
      trend: '+3',
      trendUp: true
    }
  ]

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Welcome Section */}
      <div className="card">
        <h2 className="text-2xl font-semibold text-text mb-2">
          Welcome back! 👋
        </h2>
        <p className="text-muted">
          Ready to crush your fitness goals today? Let's track your progress.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Workouts */}
      <RecentWorkouts workouts={workouts.slice(0, 3)} />
    </div>
  )
}