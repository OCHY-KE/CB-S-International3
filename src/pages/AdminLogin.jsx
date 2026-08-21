
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { setAdminSession, verifyAdminStatus } from '../utils/auth';
import styles from '../styles/AdminLogin.module.css';
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff, ShieldCheck, ShieldAlert, ArrowRight } from 'lucide-react';

function AdminLogin({ onLoginSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingAdmin, setExistingAdmin] = useState(null);

  const redirectTo = location.state?.from?.pathname || '/admin-dashboard';
  const wasRedirected = location.state?.unauthorized;

  useEffect(() => {
    const checkCurrentAdmin = async () => {
      const { isAdmin, user } = await verifyAdminStatus();
      if (isAdmin && user) {
        setExistingAdmin(user);
      }
    };
    checkCurrentAdmin();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Map custom ID to actual email before sending to API
      let cleanEmail = email.trim().toLowerCase();
      if (cleanEmail === 'cbsi@admin') {
        cleanEmail = 'mannickochieng@gmail.com';
      }

      const response = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: password.trim() }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Login failed: ${response.status} - ${text}`);
      }

      const data = await response.json();

      // Persist session with token
      setAdminSession({
        user: data.user,
        token: data.session?.access_token,
      });

      if (typeof onLoginSuccess === 'function') {
        onLoginSuccess({ email: cleanEmail, role: 'admin', user: data.user });
      }

      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  if (existingAdmin) {
    return (
      <div className={styles.loginShell}>
        <main className={styles.loginContainer}>
          <div className={styles.loginCard}>
            <div className={styles.loginHeader}>
              <div className={styles.logoBadge} style={{ background: 'rgba(197, 160, 89, 0.15)', color: '#c5a059' }}>
                <ShieldCheck size={36} />
              </div>
              <h1>Admin Authenticated</h1>
              <p>You have an active administrative session ({existingAdmin.email})</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '1.5rem' }}>
              <button 
                type="button"
                className={styles.submitButton} 
                onClick={() => navigate(redirectTo)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <span>Enter Admin Console</span>
                <ArrowRight size={18} />
              </button>
              <button 
                type="button" 
                onClick={async () => {
                  localStorage.removeItem('cbsi_admin_session');
                  await fetch('/api/admin-logout', { method: 'POST' }); // serverless logout
                  setExistingAdmin(null);
                }}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#94a3b8',
                  padding: '10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.88rem'
                }}
              >
                Sign Out & Switch Account
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.loginShell}>
      <main className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <div className={styles.logoBadge}>
              <ShieldCheck size={32} />
            </div>
            <h1>Admin Portal</h1>
            <p>Conference Bookings & Safaris International</p>
          </div>

          {wasRedirected && (
            <div 
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '10px 14px',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.85rem',
                color: '#fca5a5',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <ShieldAlert size={18} style={{ flexShrink: 0 }} />
              <span>Protected Route. Please authenticate with administrator credentials.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address / Admin ID</label>
              <div className={styles.inputWrapper}>
                <Mail size={18} className={styles.inputIcon} />
                <input 
                  id="email"
                  type="text" 
                  placeholder="admin@cb-safaris.com or CBSI@ADMIN" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <div className={styles.inputWrapper}>
                <Lock size={18} className={styles.inputIcon} />
                <input 
                  id="password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
                <button 
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className={styles.formError}>
                <AlertCircle size={18} /> 
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? <Loader2 className={styles.spinner} size={20} /> : 'Access Dashboard'}
            </button>
          </form>

          <div className={styles.loginFooter}>
            <p>Standard user? <Link to="/login">Switch to Client Login</Link></p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminLogin;
