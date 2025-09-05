import React, { useState, useEffect } from 'react'
import { useFitness } from '../../contexts/FitnessContext'
import { Brain, Lightbulb, Target, TrendingUp, RefreshCw } from 'lucide-react'

export default function Recommendations() {
  const { state, dispatch } = useFitness()
  const { workouts, aiRecommendations } = state
  const [isGenerating, setIsGenerating] = useState(false)

  // Simulated AI recommendations (in real app, this would call OpenAI API)
  const generateRecommendations = async () => {
    setIsGenerating(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const recommendations = [
      {
        id: '1',
        type: 'strength',
        title: 'Increase Bench Press Weight',
        description: 'Based on your recent sessions, you\'ve consistently completed all reps at 155 lbs. Try increasing to 160-165 lbs for your next workout.',
        priority: 'high',
        icon: Target
      },
      {
        id: '2',
        type: 'recovery',
        title: 'Add Rest Day',
        description: 'You\'ve worked out 4 consecutive days. Consider taking a rest day or doing light cardio to allow muscle recovery.',
        priority: 'medium',
        icon: TrendingUp
      },
      {
        id: '3',
        type: 'variety',
        title: 'Try New Exercises',
        description: 'Add incline dumbbell press and Bulgarian split squats to target muscles from different angles.',
        priority: 'low',
        icon: Lightbulb
      },
      {
        id: '4',
        type: 'form',
        title: 'Focus on Form',
        description: 'Your deadlift weight has increased quickly. Ensure proper form to prevent injury - consider filming yourself or asking for a spot check.',
        priority: 'high',
        icon: Target
      }
    ]
    
    dispatch({ type: 'SET_AI_RECOMMENDATIONS', payload: recommendations })
    setIsGenerating(false)
  }

  useEffect(() => {
    if (aiRecommendations.length === 0) {
      generateRecommendations()
    }
  }, [])

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-50 border-red-200 text-red-700'
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-700'
      case 'low': return 'bg-green-50 border-green-200 text-green-700'
      default: return 'bg-gray-50 border-gray-200 text-gray-700'
    }
  }

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-md">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-text">AI Coach</h2>
              <p className="text-muted">Personalized recommendations based on your workout data</p>
            </div>
          </div>
          <button 
            onClick={generateRecommendations}
            disabled={isGenerating}
            className="btn-outline inline-flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {isGenerating ? (
          <div className="text-center py-12">
            <Brain className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg font-medium text-text mb-2">Analyzing Your Data...</h3>
            <p className="text-muted">Our AI is reviewing your workout patterns to generate personalized recommendations.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {aiRecommendations.map((rec) => {
              const Icon = rec.icon
              return (
                <div key={rec.id} className={`card border ${getPriorityColor(rec.priority)}`}>
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-white rounded-md">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-text">{rec.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityBadge(rec.priority)}`}>
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-sm text-text opacity-80">{rec.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Workout Summary for AI Context */}
      <div className="card">
        <h3 className="text-lg font-medium text-text mb-4">Recent Activity Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-text">This Week</h4>
            <p className="text-sm text-muted">{workouts.length} workouts completed</p>
            <p className="text-sm text-muted">Average duration: 52 minutes</p>
            <p className="text-sm text-muted">Most trained: Upper body</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-text">Progress Trends</h4>
            <p className="text-sm text-muted">✅ Consistent workout frequency</p>
            <p className="text-sm text-muted">📈 Increasing weights gradually</p>
            <p className="text-sm text-muted">⚠️ Limited exercise variety</p>
          </div>
        </div>
      </div>
    </div>
  )
}