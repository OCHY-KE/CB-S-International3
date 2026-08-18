import { supabase } from '../supabaseClient'

export const authApi = {
  signUp: (email, password) => 
    supabase.auth.signUp({ email, password }),

  signIn: (email, password) => 
    supabase.auth.signInWithPassword({ email, password }),

  signOut: () => 
    supabase.auth.signOut(),

  getCurrentUser: () => 
    supabase.auth.getUser(),

  resetPassword: (email) => 
    supabase.auth.resetPasswordForEmail(email)
}