import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { verifyAdminStatus } from '../utils/auth';

/**
 * AdminRoute protects administrative routes under /admin.
 * Allows access only to verified administrators.
 */
const AdminRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const controller = new AbortController();

    const checkAuth = async () => {
      setChecking(true);
      try {
        const { isAdmin } = await verifyAdminStatus({ signal: controller.signal });
        if (!controller.signal.aborted) {
          setAuthorized(Boolean(isAdmin));
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Authorization check failed:', error);
          setAuthorized(false);
        }
      } finally {
        if (!controller.signal.aborted) {
          setChecking(false);
        }
      }
    };

    checkAuth();

    return () => controller.abort();
  }, [location.pathname]);

  if (checking) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center gap-4 bg-[#071321] text-white p-8 font-sans">
        <div className="w-14 h-14 rounded-full bg-[#c5a059]/15 border-2 border-[#c5a059] flex items-center justify-center text-[#c5a059] shadow-lg shadow-[#c5a059]/10">
          <ShieldCheck className="w-7 h-7" />
        </div>
        
        <div className="flex items-center gap-2.5 text-[#c5a059] font-semibold text-base">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Verifying Executive Admin Credentials...</span>
        </div>

        <p className="text-slate-400 text-sm text-center max-w-sm">
          Conference Bookings & Safaris International — Secure Operations Console
        </p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <Navigate 
        to="/admin-login" 
        state={{ from: location, unauthorized: true }} 
        replace 
      />
    );
  }

  return children ? children : <Outlet />;
};

export default AdminRoute;