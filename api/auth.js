import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Service Role for admin-level server tasks
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { identifier, password, action } = req.body

  try {
    if (!identifier || !password || !action) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    if (action === 'login') {
      // Map custom identifier to real email
      let email = identifier
      if (identifier === 'CBSI@ADMIN') {
        email = 'mannickochieng@gmail.com'
      }

      // Attempt login
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      // Verify role metadata
      const role = data.user?.user_metadata?.role
      if (role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin privileges required.' })
      }

      return res.status(200).json({
        message: 'Admin login successful',
        user: data.user
      })
    }

    if (action === 'register-admin') {
      // Register a new admin user
      const { data, error } = await supabase.auth.signUp({
        email: identifier, // here identifier should be the real email
        password,
        options: {
          data: { role: 'admin', login_id: 'CBSI@ADMIN' } // attach role + custom ID
        }
      })
      if (error) throw error

      return res.status(201).json({
        message: 'Admin registered successfully',
        user: data.user
      })
    }

    return res.status(400).json({ error: 'Invalid action provided' })
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Unexpected error occurred' })
  }
}
