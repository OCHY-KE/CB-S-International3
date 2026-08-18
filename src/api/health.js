import { supabase } from '../supabaseClient'

export const healthApi = {
  checkConnection: async () => {
    const start = Date.now()
    try {
      // We perform a simple query to a public table or a system check
      const { error } = await supabase.from('profiles').select('id').limit(1)
      
      if (error) throw error

      return {
        status: 'online',
        latency: `${Date.now() - start}ms`,
        timestamp: new Date().toISOString()
      }
    } catch (err) {
      return {
        status: 'offline',
        error: err.message,
        timestamp: new Date().toISOString()
      }
    }
  }
}