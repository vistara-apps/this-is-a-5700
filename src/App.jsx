import React, { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { FitnessProvider } from './contexts/FitnessContext'
import AuthGuard from './components/auth/AuthGuard'
import AppShell from './components/layout/AppShell'
import Dashboard from './components/pages/Dashboard'
import WorkoutLogger from './components/pages/WorkoutLogger'
import Progress from './components/pages/Progress'
import Recommendations from './components/pages/Recommendations'
import Profile from './components/pages/Profile'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'workout':
        return <WorkoutLogger />
      case 'progress':
        return <Progress />
      case 'recommendations':
        return <Recommendations />
      case 'profile':
        return <Profile />
      default:
        return <Dashboard />
    }
  }

  return (
    <AuthProvider>
      <AuthGuard>
        <FitnessProvider>
          <AppShell currentPage={currentPage} setCurrentPage={setCurrentPage}>
            {renderPage()}
          </AppShell>
        </FitnessProvider>
      </AuthGuard>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'hsl(0, 0%, 100%)',
            color: 'hsl(220, 20%, 20%)',
            border: '1px solid hsl(220, 15%, 90%)',
            borderRadius: '8px',
            boxShadow: '0 4px 12px hsla(0, 0%, 0%, 0.08)',
          },
        }}
      />
    </AuthProvider>
  )
}

export default App
