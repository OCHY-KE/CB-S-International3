import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import styles from '../styles/Ingia.module.css';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, CheckCircle2, AlertCircle, UserCheck } from 'lucide-react';

function UserLogin({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [existingUser, setExistingUser] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) setExistingUser(data.session.user);
    };
    checkSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });

      if (authError) throw authError;

      setIsSuccess(true);
      if (typeof onLoginSuccess === 'function') onLoginSuccess(data.user);

      setTimeout(() => navigate('/profile'), 1200);
    } catch (err) {
      setError(err.message || 'Invalid login credentials');
      setLoading(false);
    }
  };

  if (existingUser) {
    return (
      <div className={styles.loginWrapper}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <UserCheck size={40} className={styles.iconSuccess} />
            <h1>Already Signed In</h1>
            <p>You are currently logged in as {existingUser.email}</p>
          </div>
          <div className={styles.buttonGroup}>
            <button className={styles.submitBtn} onClick={() => navigate('/profile')}>
              Go to Profile <ArrowRight size={18} />
            </button>
            <button className={styles.outlineBtn} onClick={async () => { await supabase.auth.signOut(); window.location.reload(); }}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className={styles.loginWrapper}>
        <div className={`${styles.loginCard} ${styles.successCard}`}>
          <CheckCircle2 size={60} className={styles.animateCheck} />
          <h2>Welcome Back!</h2>
          <p>Login successful. Preparing your profile...</p>
          <div className={styles.loadingBar} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <span role="img" aria-label="globe">🌍</span>
          <h1>Welcome Back</h1>
          <p className={styles.subtitle}>Conference Bookings & Safaris International</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label>Email Address</label>
            <div className={styles.inputWrapper}>
              <Mail size={18} className={styles.inputIcon} />
              <input type="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" className={styles.passwordToggle} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <div className={styles.errorBanner}><AlertCircle size={18} /> {error}</div>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <Loader2 className={styles.spinner} size={20} /> : <>Sign In <ArrowRight size={18} /> </>}
          </button>
        </form>

        <div className={styles.loginFooter}>
          <p>New here? <Link to="/create-account" className={styles.inlineLink}>Create account</Link></p>
          <p>Admin? <Link to="/admin-login" className={styles.inlineLink}>Go to Admin Login</Link></p>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;