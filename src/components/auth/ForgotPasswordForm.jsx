import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Mail, ArrowLeft, Send } from 'lucide-react'

export default function ForgotPasswordForm({ onBackToLogin }) {
  const { resetPassword, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    setEmail(e.target.value)
    if (errors.email) {
      setErrors({})
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    const result = await resetPassword(email)
    
    if (result.success) {
      setIsSubmitted(true)
    } else {
      // Error is already handled by the auth context with toast
      console.error('Password reset failed:', result.error)
    }
  }

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="card text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="h-8 w-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-text mb-2">Check Your Email</h2>
          <p className="text-muted mb-6">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          
          <div className="space-y-4">
            <p className="text-sm text-muted">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => setIsSubmitted(false)}
                className="btn-outline"
              >
                Try Different Email
              </button>
              
              <button
                onClick={onBackToLogin}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="card">
        <div className="flex items-center mb-6">
          <button
            onClick={onBackToLogin}
            className="mr-3 p-1 text-muted hover:text-text transition-colors"
            disabled={loading}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-text">Reset Password</h2>
            <p className="text-muted">Enter your email to receive a reset link</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={handleChange}
                className={`input w-full pl-10 ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full inline-flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Send Reset Link</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-muted">
            Remember your password?{' '}
            <button
              onClick={onBackToLogin}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
              disabled={loading}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
