import { useState } from 'react'
import { supabase } from '/lib/supabaseClient'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Check your email for a confirmation link!')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
    }
    setLoading(false)
  }

  const handleGoogleSignup = async () => {
    setLoading(true)
    setMessage('')
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.signupCard}>
        <div style={styles.header}>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Join us today and get started</p>
        </div>

        {/* Google Sign Up Button */}
        <button 
          onClick={handleGoogleSignup}
          disabled={loading}
          style={loading ? styles.googleButtonDisabled : styles.googleButton}
        >
          <span style={styles.googleIcon}>🔍</span>
          Sign up with Google
        </button>

        <div style={styles.divider}>
          <span style={styles.dividerText}>or</span>
        </div>
        
        <form onSubmit={handleSignup} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              disabled={loading}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Create a password (min. 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              disabled={loading}
              minLength="6"
            />
            <div style={styles.passwordHint}>
              Must be at least 6 characters long
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={styles.input}
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            style={loading ? styles.buttonDisabled : styles.button}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        {message && (
          <div style={
            message.includes('Check your email') ? styles.messageSuccess : styles.messageError
          }>
            {message}
          </div>
        )}
        
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Already have an account? <a href="/login" style={styles.link}>Sign in here</a>
          </p>
        </div>
      </div>
    </div>
  )
}

// Use the same styles as Login component, just update the container style name
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #e0f7ff 0%, #f0faff 50%, #e6f7ff 100%)',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  signupCard: {
    background: 'white',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0, 120, 255, 0.1)',
    width: '100%',
    maxWidth: '440px',
    border: '1px solid #e1f5fe'
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  title: {
    color: '#0077cc',
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 8px 0'
  },
  subtitle: {
    color: '#66b3ff',
    fontSize: '16px',
    margin: '0',
    fontWeight: '400'
  },
  googleButton: {
    width: '100%',
    padding: '14px 20px',
    backgroundColor: 'white',
    color: '#333',
    border: '2px solid #e1f5fe',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
  },
  googleButtonDisabled: {
    width: '100%',
    padding: '14px 20px',
    backgroundColor: '#f8f9fa',
    color: '#999',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'not-allowed',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    opacity: 0.7
  },
  googleIcon: {
    fontSize: '18px'
  },
  divider: {
    position: 'relative',
    textAlign: 'center',
    margin: '20px 0'
  },
  dividerText: {
    backgroundColor: 'white',
    padding: '0 15px',
    color: '#66b3ff',
    fontSize: '14px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    color: '#0077cc',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '4px'
  },
  input: {
    padding: '14px 16px',
    border: '2px solid #e1f5fe',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    backgroundColor: '#f8fdff',
    outline: 'none',
    boxSizing: 'border-box'
  },
  passwordHint: {
    fontSize: '12px',
    color: '#66b3ff',
    marginTop: '4px'
  },
  button: {
    padding: '14px 20px',
    backgroundColor: '#4dabf5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '10px'
  },
  buttonDisabled: {
    padding: '14px 20px',
    backgroundColor: '#b3d9ff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'not-allowed',
    marginTop: '10px',
    opacity: 0.7
  },
  messageSuccess: {
    padding: '12px 16px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '8px',
    marginTop: '20px',
    border: '1px solid #c3e6cb',
    fontSize: '14px',
    textAlign: 'center'
  },
  messageError: {
    padding: '12px 16px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '8px',
    marginTop: '20px',
    border: '1px solid #f5c6cb',
    fontSize: '14px',
    textAlign: 'center'
  },
  footer: {
    textAlign: 'center',
    marginTop: '24px',
    paddingTop: '20px',
    borderTop: '1px solid #e1f5fe'
  },
  footerText: {
    color: '#66b3ff',
    fontSize: '14px',
    margin: '0'
  },
  link: {
    color: '#4dabf5',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color 0.3s ease'
  }
}