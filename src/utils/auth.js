
// src/utils/auth.js
import { supabase } from '../supabaseClient';

/**
 * Verifies if the currently authenticated user has administrative privileges.
 * Supports AbortSignal to cancel pending async operations on component unmount.
 *
 * @param {Object} [options]
 * @param {AbortSignal} [options.signal] - Optional signal for cancellation.
 * @returns {Promise<{isAdmin: boolean, user: Object|null}>}
 */
export async function verifyAdminStatus(options = {}) {
  const { signal } = options;

  try {
    // Check if operation was aborted early
    if (signal?.aborted) {
      return { isAdmin: false, user: null };
    }

    // 1. Fetch active session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.user || signal?.aborted) {
      return { isAdmin: false, user: null };
    }

    const userId = session.user.id;

    // 2. Query admin_profiles table for verified admin status
    const { data: profile, error: profileError } = await supabase
      .from('admin_profiles')
      .select('is_admin')
      .eq('user_id', userId)
      .maybeSingle();

    if (signal?.aborted) {
      return { isAdmin: false, user: null };
    }

    if (!profileError && profile?.is_admin) {
      return { isAdmin: true, user: session.user };
    }

    // 3. Fallback: check metadata role flag
    const isMetadataAdmin = session.user.user_metadata?.role === 'admin';
    return { isAdmin: isMetadataAdmin, user: session.user };

  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error('Error verifying admin status:', err);
    }
    return { isAdmin: false, user: null };
  }
}

/**
 * Signs out the active user and purges all administrative session flags.
 *
 * @returns {Promise<{success: boolean, error?: Error}>}
 */
export async function adminSignOut() {
  try {
    // Purge local session security keys
    sessionStorage.removeItem('cbsi_show_admin_security_warning');
    sessionStorage.removeItem('cbsi_admin_warning_dismissed');
    localStorage.removeItem('cbsi_admin_cache');

    // Sign out active Supabase session
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error performing admin sign out:', error);
    return { success: false, error };
  }
}

/**
 * Convenience helper to obtain the active authenticated user object.
 *
 * @returns {Promise<Object|null>}
 */
export async function getCurrentUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user || null;
  } catch (err) {
    console.error('Error fetching current user:', err);
    return null;
  }
}