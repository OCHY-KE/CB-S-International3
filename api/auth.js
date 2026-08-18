import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use Service Role for admin-level server tasks
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })
  
  const { email, password, action } = req.body

  try {
    if (action === 'login') {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      return res.status(200).json(data)
    }
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}