import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import styles from '../styles/CA.module.css';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';

function CreateAccount({ onSignupSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const title = 'Create Account';
  const subtitle = 'Conference Bookings & Safaris International';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!supabase) {
        throw new Error('Supabase environment variables are not configured.');
      }

      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });

      if (authError) throw authError;

      if (typeof onSignupSuccess === 'function') {
        onSignupSuccess(data.user);
      }

      // Redirect to home or dashboard
      navigate('/');
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
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="signup-email">Email Address</label>
            <div className={styles.inputRelative}>
              <Mail className={styles.inputIcon} size={18} />
              <input
                id="signup-email"
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
            <label htmlFor="signup-password">Password</label>
            <div className={styles.inputRelative}>
              <Lock className={styles.inputIcon} size={18} />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
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
                Create Account <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className={styles.loginFooter}>
          <p>
            Already have an account?{' '}
            <button
              type="button"
              className={styles.inlineLink}
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;
