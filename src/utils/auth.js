import { supabase } from '../supabaseClient';

const ADMIN_SESSION_KEY = 'cbsi_admin_session';

/**
 * Check if the currently active session belongs to an authorized administrator.
 */
export async function verifyAdminStatus() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session?.user) {
      // Fallback: check localStorage
      const stored = localStorage.getItem(ADMIN_SESSION_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed?.role === 'admin') {
            return { isAdmin: true, user: parsed };
          }
        } catch {
          localStorage.removeItem(ADMIN_SESSION_KEY);
        }
      }
      return { isAdmin: false, user: null };
    }

    const authUser = session.user;
    const userRole = authUser.user_metadata?.role || authUser.app_metadata?.role;
    const isAdmin = userRole === 'admin';

    if (isAdmin) {
      const adminData = {
        id: authUser.id,
        email: authUser.email,
        role: 'admin',
        token: session.access_token, // persist token
        lastVerified: new Date().toISOString()
      };
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminData));
      return { isAdmin: true, user: authUser };
    }

    // Fallback: check stored admin session
    const stored = localStorage.getItem(ADMIN_SESSION_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.email === authUser.email && parsed?.role === 'admin') {
        return { isAdmin: true, user: authUser };
      }
    }

    return { isAdmin: false, user: authUser };
  } catch (err) {
    console.error('Error verifying admin status:', err);
    return { isAdmin: false, user: null };
  }
}

/**
 * Sign out administrator
 */
export async function adminSignOut() {
  try {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    await supabase.auth.signOut();
  } catch (err) {
    console.error('Error signing out admin:', err);
  }
}

/**
 * Store admin authentication after successful login
 */
export function setAdminSession({ user, token }) {
  const adminData = {
    id: user.id || 'admin-root',
    email: user.email || 'admin@cb-safaris.com',
    role: 'admin',
    token: token || null,
    loginTime: new Date().toISOString()
  };
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminData));
}
