import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '/lib/supabaseClient'

export default function Signup() {
  const router = useRouter()
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
      setMessage('Account created! Redirecting...')
      // Redirect to dashboard after 1.5 seconds
      setTimeout(() => router.push('/dashboard'), 1500)
    }
    setLoading(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.signupCard}>
        <h2 style={styles.title}>Create Account</h2>
        <form onSubmit={handleSignup} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={styles.input}
            disabled={loading}
          />
          <button type="submit" style={loading ? styles.buttonDisabled : styles.button} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {message && (
          <p style={message.includes('created') ? styles.messageSuccess : styles.messageError}>{message}</p>
        )}

        <p style={styles.footerText}>
          Already have an account? <Link href="/login" style={styles.link}>Login here</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111', // black background
    color: '#fff',
    fontFamily: 'sans-serif',
    padding: '20px'
  },
  signupCard: {
    backgroundColor: '#000', // dark card
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 0 20px rgba(255,255,255,0.1)',
    width: '100%',
    maxWidth: '400px',
    border: '1px solid #333'
  },
  title: {
    textAlign: 'center',
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '24px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  input: {
    padding: '12px 14px',
    borderRadius: '6px',
    border: '1px solid #444',
    backgroundColor: '#111',
    color: '#fff',
    outline: 'none',
    fontSize: '16px'
  },
  button: {
    padding: '12px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#fff',
    color: '#000',
    fontWeight: '600',
    cursor: 'pointer',
    transition: '0.3s'
  },
  buttonDisabled: {
    padding: '12px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#555',
    color: '#aaa',
    fontWeight: '600',
    cursor: 'not-allowed',
    opacity: 0.7
  },
  messageSuccess: {
    marginTop: '16px',
    color: '#4caf50',
    textAlign: 'center'
  },
  messageError: {
    marginTop: '16px',
    color: '#f44336',
    textAlign: 'center'
  },
  footerText: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#aaa'
  },
  link: {
    color: '#fff',
    textDecoration: 'underline',
    cursor: 'pointer'
  }
}
