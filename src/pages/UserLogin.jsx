import { useState } from 'react'

function UserLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate user login validation
    if (email && password.length >= 6) {
      // Call parent callback to indicate successful login
      setTimeout(() => {
        onLoginSuccess({ email, role: 'user' })
        setLoading(false)
      }, 1000)
    } else {
      setError('Please enter valid email and password (min 6 characters)')
      setLoading(false)
    }
  }

  return (
    <div className="login-shell">
      <main className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>User Login</h1>
            <p>Conference Bookings & Safaris International</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="user-email">Email Address</label>
              <input
                id="user-email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="user-password">Password</label>
              <input
                id="user-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="form-error">{error}</div>}

            <button
              type="submit"
              className="cta-button primary"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login to Your Account'}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don't have an account?{' '}
              <a href="#signup" className="login-link">
                Sign up here
              </a>
            </p>
            <p>
              Are you an admin?{' '}
              <a href="#admin-login" className="login-link">
                Admin login
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default UserLogin
