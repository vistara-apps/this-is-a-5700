import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth, db, supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    // Get initial session
    auth.getSession().then(({ session, error }) => {
      if (error) {
        console.error('Error getting session:', error)
      } else {
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) {
          loadUserProfile(session.user.id)
        }
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await loadUserProfile(session.user.id)
        } else {
          setUserProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (userId) => {
    try {
      const { data, error } = await db.getUser(userId)
      if (error) {
        console.error('Error loading user profile:', error)
        toast.error('Failed to load user profile')
      } else {
        setUserProfile(data)
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
      toast.error('Failed to load user profile')
    }
  }

  const signUp = async (email, password) => {
    try {
      setLoading(true)
      const { data, error } = await auth.signUp(email, password)
      
      if (error) {
        toast.error(error.message)
        return { success: false, error }
      }
      
      if (data.user && !data.user.email_confirmed_at) {
        toast.success('Check your email for the confirmation link!')
      }
      
      return { success: true, data }
    } catch (error) {
      toast.error('An unexpected error occurred')
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      const { data, error } = await auth.signIn(email, password)
      
      if (error) {
        toast.error(error.message)
        return { success: false, error }
      }
      
      toast.success('Welcome back!')
      return { success: true, data }
    } catch (error) {
      toast.error('An unexpected error occurred')
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await auth.signOut()
      
      if (error) {
        toast.error(error.message)
        return { success: false, error }
      }
      
      setUser(null)
      setUserProfile(null)
      setSession(null)
      toast.success('Signed out successfully')
      return { success: true }
    } catch (error) {
      toast.error('An unexpected error occurred')
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email) => {
    try {
      const { data, error } = await auth.resetPassword(email)
      
      if (error) {
        toast.error(error.message)
        return { success: false, error }
      }
      
      toast.success('Password reset email sent!')
      return { success: true, data }
    } catch (error) {
      toast.error('An unexpected error occurred')
      return { success: false, error }
    }
  }

  const updatePassword = async (password) => {
    try {
      const { data, error } = await auth.updatePassword(password)
      
      if (error) {
        toast.error(error.message)
        return { success: false, error }
      }
      
      toast.success('Password updated successfully!')
      return { success: true, data }
    } catch (error) {
      toast.error('An unexpected error occurred')
      return { success: false, error }
    }
  }

  const updateProfile = async (updates) => {
    try {
      if (!user) {
        throw new Error('No user logged in')
      }
      
      const { data, error } = await db.updateUser(user.id, updates)
      
      if (error) {
        toast.error(error.message)
        return { success: false, error }
      }
      
      setUserProfile(data)
      toast.success('Profile updated successfully!')
      return { success: true, data }
    } catch (error) {
      toast.error('An unexpected error occurred')
      return { success: false, error }
    }
  }

  const value = {
    user,
    userProfile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    isAuthenticated: !!user,
    isSubscribed: userProfile?.subscription_tier !== 'free',
    subscriptionTier: userProfile?.subscription_tier || 'free'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
