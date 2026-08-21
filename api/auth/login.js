import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // 1. Enforce POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Validate environment configuration
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return res.status(500).json({ error: 'Server authentication setup error.' });
  }

  // 3. Initialize stateless Supabase client
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });

  try {
    const { identifier, password, action } = req.body || {};

    // 4. Validate payload
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const email = identifier.trim().toLowerCase();
    const cleanPassword = password.trim();

    // -------------------------------------------------------------
    // ACTION: LOGIN
    // -------------------------------------------------------------
    if (!action || action === 'login') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: cleanPassword,
      });

      if (error) {
        return res.status(401).json({ error: error.message || 'Invalid credentials' });
      }

      return res.status(200).json({
        message: 'Login successful',
        user: {
          id: data.user.id,
          email: data.user.email,
        },
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
        },
      });
    }

    // -------------------------------------------------------------
    // ACTION: REGISTER
    // -------------------------------------------------------------
    if (action === 'register') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: cleanPassword,
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(201).json({
        message: 'Registration successful',
        user: {
          id: data.user?.id,
          email: data.user?.email,
        },
        session: data.session
          ? {
              access_token: data.session.access_token,
              refresh_token: data.session.refresh_token,
              expires_at: data.session.expires_at,
            }
          : null,
      });
    }

    return res.status(400).json({ error: 'Invalid action provided' });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}