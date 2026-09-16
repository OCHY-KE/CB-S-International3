import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // safe only on serverless backend
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Ensure JSON body is parsed
    const { identifier, password, action } = req.body || {};

    if (!identifier || !password || !action) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (action === 'login') {
      // Map custom ID to real email
      let email = identifier.trim();
      if (email.toLowerCase() === 'cbsi@admin') {
        email = 'mannickochieng@gmail.com';
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: password.trim(),
      });
      if (error) throw error;

      const role = data.user?.app_metadata?.role;
      if (role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
      }

      return res.status(200).json({
        message: 'Admin login successful',
        user: data.user,
        session: data.session, // includes access_token
      });
    }

    return res.status(400).json({ error: 'Invalid action provided' });
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Unexpected error occurred' });
  }
}
