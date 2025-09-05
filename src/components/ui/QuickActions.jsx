import React from 'react'
import { Plus, TrendingUp, Brain, Target } from 'lucide-react'

export default function QuickActions() {
  const actions = [
    {
      title: 'Start Workout',
      description: 'Begin a new session',
      icon: Plus,
      color: 'bg-primary',
      textColor: 'text-white'
    },
    {
      title: 'View Progress',
      description: 'Check your stats',
      icon: TrendingUp,
      color: 'bg-accent',
      textColor: 'text-white'
    },
    {
      title: 'AI Insights',
      description: 'Get recommendations',
      icon: Brain,
      color: 'bg-purple-500',
      textColor: 'text-white'
    },
    {
      title: 'Set Goals',
      description: 'Update targets',
      icon: Target,
      color: 'bg-orange-500',
      textColor: 'text-white'
    }
  ]

  return (
    <div className="card">
      <h3 className="text-lg font-medium text-text mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <button
              key={index}
              className={`${action.color} ${action.textColor} p-4 rounded-lg text-left hover:opacity-90 transition-opacity`}
            >
              <Icon className="h-6 w-6 mb-2" />
              <h4 className="font-medium text-sm">{action.title}</h4>
              <p className="text-xs opacity-80">{action.description}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}