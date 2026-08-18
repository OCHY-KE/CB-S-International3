import { useState } from 'react';
import { supabase } from '../supabaseClient';
import styles from '../styles/Ingia.module.css';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';

function UserLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      onLoginSuccess(data.user);
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
          <h1>Welcome Back</h1>
          <p>Conference Bookings & Safaris International</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="user-email">Email Address</label>
            <div className={styles.inputRelative}>
              <Mail className={styles.inputIcon} size={18} />
              <input
                id="user-email"
                type="email"
                placeholder="name@company.com"
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
                Sign In <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className={styles.loginFooter}>
          <p>
            New to the platform? <a href="#signup">Create account</a>
          </p>
          <div className={styles.divider}><span>OR</span></div>
          <a href="#admin-login" className={styles.adminLink}>
            Staff & Admin Portal
          </a>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
