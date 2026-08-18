import { supabase } from '../supabaseClient'

export const configApi = {
  getAppConfig: async () => {
    const { data, error } = await supabase
      .from('app_settings') // Name of your settings table
      .select('*')
    
    // Transform array into an object for easier use
    const config = data?.reduce((acc, item) => {
      acc[item.key] = item.value
      return acc
    }, {})

    return { data: config, error }
  }
}