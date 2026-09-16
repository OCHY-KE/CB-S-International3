import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import styles from '../styles/AL.module.css';
import { User, Lock, Loader2, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';

function AdminLogin() {
  const navigate = useNavigate();
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      const formattedAdminId = adminId.trim().toLowerCase();

      // 1. Look up the account email associated with this Admin ID in Supabase
      const { data: adminProfile, error: lookupError } = await supabase
        .from('admin_profiles')
        .select('user_id, email, is_admin')
        .eq('admin_id', formattedAdminId)
        .maybeSingle();

      if (lookupError || !adminProfile) {
        setStatus({ type: 'error', msg: 'Invalid Admin Credentials.' });
        setLoading(false);
        return;
      }

      // 2. Authenticate against Supabase Auth using the retrieved email
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: adminProfile.email,
        password,
      });

      if (authError) {
        setStatus({ type: 'error', msg: authError.message });
        setLoading(false);
        return;
      }

      // 3. Double-check admin privilege verification
      if (!adminProfile.is_admin) {
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
      }, 2000);

    } catch (err) {
      console.error('Unexpected error during login:', err);
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
                <label htmlFor="adminId">Admin ID</label>
                <div className={styles.inputWrapper}>
                  <User size={18} className={styles.inputIcon} />
                  <input
                    id="adminId"
                    type="text"
                    placeholder="private@admin"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="username"
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