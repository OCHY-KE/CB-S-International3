import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Service Role for admin-level server tasks
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Hardcoded one-time admin creation
    const { data, error } = await supabase.auth.signUp({
      email: 'mannickochieng@gmail.com',
      password: 'OCHY&ABU/Tech@2026',
      options: {
        data: {
          role: 'admin',
          login_id: 'CBSI@ADMIN' // custom ID for login
        }
      }
    })

    if (error) throw error

    return res.status(201).json({
      message: 'Admin registered successfully',
      user: data.user
    })
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Unexpected error occurred' })
  }
}
