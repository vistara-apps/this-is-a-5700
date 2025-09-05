import React, { useState } from 'react'
import { useFitness } from '../../contexts/FitnessContext'
import { User, Settings, Crown, Star, Calendar } from 'lucide-react'

export default function Profile() {
  const { state } = useFitness()
  const { user, workouts } = state
  const [activeTab, setActiveTab] = useState('overview')

  const subscriptionTiers = {
    'free': { name: 'Free', color: 'text-gray-600', icon: User },
    'pro': { name: 'Pro', color: 'text-primary', icon: Star },
    'elite': { name: 'Elite', color: 'text-yellow-600', icon: Crown }
  }

  const currentTier = subscriptionTiers[user.subscriptionTier]
  const TierIcon = currentTier.icon

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  })

  const totalWorkouts = workouts.length
  const totalMinutes = workouts.reduce((sum, w) => sum + w.duration, 0)
  const avgSessionLength = totalWorkouts > 0 ? Math.round(totalMinutes / totalWorkouts) : 0

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Profile Header */}
      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-text">{user.email.split('@')[0]}</h2>
            <div className="flex items-center space-x-2">
              <TierIcon className={`h-4 w-4 ${currentTier.color}`} />
              <span className={`font-medium ${currentTier.color}`}>{currentTier.name} Member</span>
            </div>
            <p className="text-sm text-muted">Member since {memberSince}</p>
          </div>
        </div>

        {/* Subscription Status */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-4 rounded-lg border border-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-text">Current Plan: {currentTier.name}</h3>
              <p className="text-sm text-muted">
                {user.subscriptionTier === 'free' && 'Upgrade for advanced analytics and AI coaching'}
                {user.subscriptionTier === 'pro' && 'Access to advanced analytics and recommendations'}
                {user.subscriptionTier === 'elite' && 'Full access to all premium features'}
              </p>
            </div>
            {user.subscriptionTier === 'free' && (
              <button className="btn-primary">Upgrade</button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex border-b border-gray-200 mb-6">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'stats', label: 'Statistics' },
            { id: 'settings', label: 'Settings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted hover:text-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card bg-primary/5 border border-primary/10">
                <h4 className="font-medium text-text mb-2">Total Workouts</h4>
                <p className="text-2xl font-bold text-primary">{totalWorkouts}</p>
              </div>
              <div className="card bg-accent/5 border border-accent/10">
                <h4 className="font-medium text-text mb-2">Total Time</h4>
                <p className="text-2xl font-bold text-accent">{totalMinutes}m</p>
              </div>
              <div className="card bg-orange-50 border border-orange-200">
                <h4 className="font-medium text-text mb-2">Avg Session</h4>
                <p className="text-2xl font-bold text-orange-600">{avgSessionLength}m</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-text mb-4">Recent Achievements</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-text">Personal Best!</p>
                    <p className="text-sm text-muted">New deadlift PR: 265 lbs</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-text">Consistency Streak</p>
                    <p className="text-sm text-muted">7 days of regular workouts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-text mb-4">Workout Distribution</h4>
              <div className="space-y-3">
                {[
                  { name: 'Upper Body', percentage: 45, color: 'bg-primary' },
                  { name: 'Lower Body', percentage: 35, color: 'bg-accent' },
                  { name: 'Cardio', percentage: 15, color: 'bg-orange-500' },
                  { name: 'Core', percentage: 5, color: 'bg-purple-500' }
                ].map((category) => (
                  <div key={category.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text">{category.name}</span>
                      <span className="text-muted">{category.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${category.color}`}
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-text mb-4">Monthly Summary</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted">This Month</p>
                  <p className="text-xl font-bold text-text">12 workouts</p>
                </div>
                <div>
                  <p className="text-sm text-muted">Last Month</p>
                  <p className="text-xl font-bold text-text">8 workouts</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-text mb-4">Preferences</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-text">Email Notifications</p>
                    <p className="text-sm text-muted">Receive workout reminders and progress updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-text">Auto-track Rest Times</p>
                    <p className="text-sm text-muted">Automatically time rest periods between sets</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-text mb-4">Units</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Weight Unit</label>
                  <select className="input">
                    <option>Pounds (lbs)</option>
                    <option>Kilograms (kg)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Distance Unit</label>
                  <select className="input">
                    <option>Miles</option>
                    <option>Kilometers</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button className="text-red-600 hover:text-red-700 font-medium">
                Delete Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}