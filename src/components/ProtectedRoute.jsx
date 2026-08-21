import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2, User, Lock } from 'lucide-react';
import { supabase } from '../supabaseClient';

/**
 * ProtectedRoute guards client-specific authenticated views (e.g. /profile).
 * If the user is unauthenticated, redirects them to /login with state.from
 */
const ProtectedRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted) {
          setAuthenticated(!!session?.user);
          setChecking(false);
        }
      } catch (err) {
        console.error('Auth verification error:', err);
        if (isMounted) {
          setAuthenticated(false);
          setChecking(false);
        }
      }
    };

    checkUser();

    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  if (checking) {
    return (
      <div
        style={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '14px',
          fontFamily: 'Inter, sans-serif',
          background: '#f8fafc',
          color: '#0b1d4d',
          padding: '2rem'
        }}
      >
        <div
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'rgba(11, 29, 77, 0.08)',
            border: '2px solid #0b1d4d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0b1d4d'
          }}
        >
          <User size={24} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0b1d4d', fontWeight: 600 }}>
          <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
          <span>Verifying Explorer Session...</span>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;