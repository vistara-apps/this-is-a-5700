import React, { useState } from 'react'
import { FitnessProvider } from './contexts/FitnessContext'
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
    <FitnessProvider>
      <AppShell currentPage={currentPage} setCurrentPage={setCurrentPage}>
        {renderPage()}
      </AppShell>
    </FitnessProvider>
  )
}

export default App