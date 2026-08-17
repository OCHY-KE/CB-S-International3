import { useState } from 'react'

function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate admin login validation
    if (email && password.length >= 6) {
      // Call parent callback to indicate successful login
      setTimeout(() => {
        onLoginSuccess({ email, role: 'admin' })
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
            <h1>Admin Login</h1>
            <p>Conference Bookings & Safaris International</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="admin-email">Email Address</label>
              <input
                id="admin-email"
                type="email"
                placeholder="admin@conferencebookingsandsafaris.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
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
              {loading ? 'Logging in...' : 'Login to Dashboard'}
            </button>
          </form>

          <div className="login-footer">
            <p>Admin access only. If you're a user, please visit the main site.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminLogin
