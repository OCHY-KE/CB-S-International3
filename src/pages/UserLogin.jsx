import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import styles from '../styles/Ingia.module.css';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';

const DEMO_USERS = {
  user: { email: 'user@cbsi.com', password: 'user123' },
  admin: { email: 'admin@cbsi.com', password: 'admin123' },
};

function Login({ defaultMode = 'user', onLoginSuccess }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState(defaultMode === 'admin' ? 'admin' : 'user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const title = mode === 'admin' ? 'Admin Access' : 'Welcome Back';
  const subtitle = 'Conference Bookings & Safaris International';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const enteredEmail = email.trim().toLowerCase();
      const enteredPassword = password.trim();
      const demoUser = DEMO_USERS[mode];

      if (
        demoUser &&
        enteredEmail === demoUser.email.toLowerCase() &&
        enteredPassword === demoUser.password
      ) {
        const user = { email: enteredEmail, role: mode };

        if (typeof onLoginSuccess === 'function') {
          onLoginSuccess(user);
        }

        localStorage.setItem('cbsi_user', JSON.stringify(user));
        navigate(mode === 'admin' ? '/admin-dashboard' : '/');
        return;
      }

      if (!supabase) {
        throw new Error('Login is unavailable because Supabase environment variables are not configured.');
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: enteredEmail,
        password: enteredPassword,
      });

      if (authError) throw authError;

      if (typeof onLoginSuccess === 'function') {
        onLoginSuccess(data.user);
      }

      navigate(mode === 'admin' ? '/admin-dashboard' : '/');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <div className={styles.brandLogo}>
            <div className={styles.logoIcon}>🌍</div>
          </div>
          <div className={styles.modeSwitch}>
            <button
              type="button"
              className={`${styles.modeButton} ${mode === 'user' ? styles.modeButtonActive : ''}`}
              onClick={() => setMode('user')}
            >
              User Login
            </button>
            <button
              type="button"
              className={`${styles.modeButton} ${mode === 'admin' ? styles.modeButtonActive : ''}`}
              onClick={() => setMode('admin')}
            >
              Admin Login
            </button>
          </div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="user-email">Email Address</label>
            <div className={styles.inputRelative}>
              <Mail className={styles.inputIcon} size={18} />
              <input
                id="user-email"
                type="email"
                placeholder={mode === 'admin' ? 'admin@company.com' : 'name@company.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="user-password">Password</label>
              <a href="#forgot" className={styles.forgotLink}>Forgot?</a>
            </div>
            <div className={styles.inputRelative}>
              <Lock className={styles.inputIcon} size={18} />
              <input
                id="user-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
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
            <div className={styles.errorBanner} role="alert">
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className={styles.spinner} size={20} />
            ) : (
              <>
                {mode === 'admin' ? 'Access Dashboard' : 'Sign In'} <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className={styles.loginFooter}>
          <p>
            {mode === 'admin' ? 'Need user access?' : 'New to the platform?'} <button type="button" className={styles.inlineLink} onClick={() => setMode(mode === 'admin' ? 'user' : 'admin')}>{mode === 'admin' ? 'Switch to user login' : 'Create account'}</button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
