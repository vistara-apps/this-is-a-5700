import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import ForgotPasswordForm from './ForgotPasswordForm'
import { Dumbbell } from 'lucide-react'

export default function AuthGuard({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const [authMode, setAuthMode] = useState('login') // 'login', 'signup', 'forgot-password'

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 mb-4">
              <Dumbbell className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-text">FitFlow AI</h1>
            </div>
            <p className="text-muted">Automated Exercise Tracking & Personalized Growth Insights</p>
          </div>

          {/* Auth Forms */}
          {authMode === 'login' && (
            <LoginForm
              onToggleMode={() => setAuthMode('signup')}
              onForgotPassword={() => setAuthMode('forgot-password')}
            />
          )}
          
          {authMode === 'signup' && (
            <SignupForm
              onToggleMode={() => setAuthMode('login')}
            />
          )}
          
          {authMode === 'forgot-password' && (
            <ForgotPasswordForm
              onBackToLogin={() => setAuthMode('login')}
            />
          )}
        </div>
      </div>
    )
  }

  return children
}
