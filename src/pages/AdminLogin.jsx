import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import styles from '../styles/Auth.module.css';
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';

function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      // Map Admin ID to email
      let email;
      if (username.trim().toLowerCase() === 'cbsi@admin') {
        email = 'mannickochieng@gmail.com';
      } else {
        setStatus({ type: 'error', msg: 'Invalid Admin Credentials' });
        setLoading(false);
        return;
      }

      // Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setStatus({ type: 'error', msg: authError.message });
        setLoading(false);
        return;
      }

      // Verify admin status
      let isAdmin = false;

      // 1. Check user metadata first
      if (authData.user.user_metadata?.role === 'admin') {
        isAdmin = true;
      }

      // 2. Check profiles table safely using .maybeSingle()
      if (!isAdmin) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', authData.user.id)
          .maybeSingle();

        if (profile?.is_admin) {
          isAdmin = true;
        }
      }

      // Fallback: If login email matches hardcoded admin email
      if (authData.user.email === 'mannickochieng@gmail.com') {
        isAdmin = true;
      }

      if (!isAdmin) {
        await supabase.auth.signOut();
        setStatus({ type: 'error', msg: 'Unauthorized: Admin access required.' });
        setLoading(false);
        return;
      }

      // Success
      setStatus({ type: 'success', msg: 'Verification successful! Redirecting to dashboard...' });
      window.dispatchEvent(new CustomEvent('login-success'));

      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 2500);

    } catch (err) {
      console.error('Unexpected error:', err);
      setStatus({ type: 'error', msg: 'Something went wrong during login.' });
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

          {status.type === 'success' ? (
            <div className={styles.successWrapper}>
              <div className={styles.checkmark}>✓</div>
              <p>{status.msg}</p>
              <div className={styles.progressBar}>
                <div className={styles.progressFill}></div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLogin} className={styles.loginForm}>
              {status.type === 'error' && (
                <div className={styles.formError}>
                  <AlertCircle size={18} /> <span>{status.msg}</span>
                </div>
              )}

              <div className={styles.formGroup}>
                <label htmlFor="username">Admin ID</label>
                <div className={styles.inputWrapper}>
                  <Mail size={18} className={styles.inputIcon} />
                  <input
                    id="username"
                    type="text"
                    placeholder="CBSI@ADMIN"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password">Password</label>
                <div className={styles.inputWrapper}>
                  <Lock size={18} className={styles.inputIcon} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
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

              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? <Loader2 className={styles.spinner} size={20} /> : 'Access Dashboard'}
              </button>
            </form>
          )}

          <div className={styles.loginFooter}>
            <p>Standard user? <Link to="/login">Switch to Client Login</Link></p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminLogin;