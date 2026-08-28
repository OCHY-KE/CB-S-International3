import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import styles from '../styles/Auth.module.css';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, CheckCircle2, AlertCircle, UserCheck, ArrowLeft, Globe, Compass } from 'lucide-react';

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
        <div className={styles.containerBox}>
          <div className={styles.topNavWrapper}>
            <Link to="/" className={styles.backToPublic}>
              <ArrowLeft size={16} />
              <span>Return to Public Site</span>
            </Link>
          </div>
          <div className={styles.loginCard}>
            <div className={styles.loginHeader}>
              <div className={`${styles.logoBadge} ${styles.userBadge}`}>
                <UserCheck size={30} />
              </div>
              <h1>Already Signed In</h1>
              <p className={styles.subtitle}>You are currently logged in as {existingUser.email}</p>
            </div>
            <div className={styles.buttonGroup}>
              <button className={`${styles.submitBtn} ${styles.userSubmitBtn}`} onClick={() => navigate('/profile')}>
                Go to Profile <ArrowRight size={18} />
              </button>
              <button className={styles.publicBtn} onClick={() => navigate('/')}>
                <Globe size={16} /> Return to Public Site
              </button>
              <button className={styles.outlineBtn} onClick={async () => { await supabase.auth.signOut(); window.location.reload(); }}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className={styles.loginWrapper}>
        <div className={styles.containerBox}>
          <div className={`${styles.loginCard} ${styles.successCard}`}>
            <CheckCircle2 size={56} className={styles.animateCheck} />
            <h2>Welcome Back!</h2>
            <p className={styles.subtitle}>Login successful. Preparing your profile...</p>
            <div className={styles.loadingBar} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.containerBox}>
        {/* Top Return to Public Link */}
        <div className={styles.topNavWrapper}>
          <Link to="/" className={styles.backToPublic}>
            <ArrowLeft size={16} />
            <span>Return to Public Site</span>
          </Link>
        </div>

        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <div className={`${styles.logoBadge} ${styles.userBadge}`}>
              <Compass size={32} />
            </div>
            <h1>Welcome Back</h1>
            <p className={styles.subtitle}>Conference Bookings & Safaris International</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label>Email Address</label>
              <div className={styles.inputWrapper}>
                <Mail size={18} className={styles.inputIcon} />
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Password</label>
              <div className={styles.inputWrapper}>
                <Lock size={18} className={styles.inputIcon} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
                <button 
                  type="button" 
                  className={styles.passwordToggle} 
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className={styles.errorBanner}>
                <AlertCircle size={18} /> <span>{error}</span>
              </div>
            )}

            <button type="submit" className={`${styles.submitBtn} ${styles.userSubmitBtn}`} disabled={loading}>
              {loading ? <Loader2 className={styles.spinner} size={20} /> : <>Sign In <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className={styles.loginFooter}>
            <p>New here? <Link to="/create-account" className={styles.inlineLink}>Create an account</Link></p>
            <p>Staff or Admin? <Link to="/admin-login" className={styles.inlineLink}>Go to Admin Login</Link></p>
            <div className={styles.publicReturnDivider}>
              <Link to="/" className={styles.returnPublicLink}>
                <Globe size={15} />
                <span>Return to Public Website</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;