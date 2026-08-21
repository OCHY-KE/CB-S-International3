import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  // Optional: map custom ID to real email
  const loginEmail = email.trim().toLowerCase() === 'cbsi@admin'
    ? 'mannickochieng@gmail.com'
    : email.trim().toLowerCase();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password,
    });

    if (error) throw error;

    const role = data.user?.user_metadata?.role;
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    return res.status(200).json({
      message: 'Admin login successful',
      user: data.user,
      session: data.session,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Unexpected error occurred' });
  }
}
