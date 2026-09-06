import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ShieldAlert, Loader2, ShieldCheck, Lock } from 'lucide-react';
import { verifyAdminStatus } from '../utils/auth';

/**
 * AdminRoute protects administrative operations routes under /admin.
 * Only users authenticated as administrators are permitted access.
 * Non-admins and unauthenticated visitors are redirected to /admin-login.
 */
const AdminRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      setChecking(true);
      const { isAdmin } = await verifyAdminStatus();
      if (isMounted) {
        setAuthorized(isAdmin);
        setChecking(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  if (checking) {
    return (
      <div
        style={{
          minHeight: '75vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          fontFamily: 'Inter, sans-serif',
          background: '#071321',
          color: '#ffffff',
          padding: '2rem'
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(197, 160, 89, 0.15)',
            border: '2px solid #c5a059',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#c5a059'
          }}
        >
          <ShieldCheck size={28} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#c5a059', fontWeight: 600 }}>
          <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
          <span>Verifying Executive Admin Credentials...</span>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0, textAlign: 'center' }}>
          Conference Bookings & Safaris International — Secure Operations Console
        </p>
      </div>
    );
  }

  if (!authorized) {
    // Redirect to Admin Login with source location for seamless post-login return
    return <Navigate to="/admin-login" state={{ from: location, unauthorized: true }} replace />;
  }

  return children;
};

export default AdminRoute;