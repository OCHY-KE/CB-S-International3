import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import styles from '../styles/AdminLogin.module.css';
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';

function AdminLogin({ onLoginSuccess }) {
  const navigate = useNavigate();
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
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });

      if (authError) throw authError;

      const role = data.user?.user_metadata?.role;
      if (role !== 'admin') throw new Error('Access denied. Admin privileges required.');

      if (typeof onLoginSuccess === 'function') {
        onLoginSuccess({ email, role: 'admin' });
      }

      navigate('/admin-dashboard');
    } catch (err) {
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

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

          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <div className={styles.inputWrapper}>
                <Mail size={18} className={styles.inputIcon} />
                <input 
                  id="email"
                  type="email" 
                  placeholder="admin@cb-safaris.com" 
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
            <p>Standard user? <a href="/login">Switch to Client Login</a></p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminLogin;