import React from 'react'
import { Home, Dumbbell, TrendingUp, Brain, User, Menu, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'workout', label: 'Workout', icon: Dumbbell },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
  { id: 'recommendations', label: 'AI Coach', icon: Brain },
  { id: 'profile', label: 'Profile', icon: User },
]

export default function AppShell({ children, currentPage, setCurrentPage }) {
  const { signOut, userProfile } = useAuth()
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface shadow-card sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Dumbbell className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold text-text">FitFlow AI</h1>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                      currentPage === item.id
                        ? 'bg-primary text-white'
                        : 'text-muted hover:text-text hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                )
              })}
              <div className="ml-4 pl-4 border-l border-gray-200">
                <button
                  onClick={signOut}
                  className="flex items-center space-x-2 px-3 py-2 text-muted hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            </div>
            <button className="md:hidden p-2">
              <Menu className="h-6 w-6 text-text" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6">
        {children}
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-200">
        <div className="flex justify-around py-2">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex flex-col items-center space-y-1 p-2 ${
                  currentPage === item.id ? 'text-primary' : 'text-muted'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
