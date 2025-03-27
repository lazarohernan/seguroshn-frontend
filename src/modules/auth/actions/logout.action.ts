import { supabase } from '@/lib/supabase'

export const logoutAction = async () => {
  const { error } = await supabase.auth.signOut()

  if (error) throw error

  return {
    ok: true,
    message: 'Sesión cerrada correctamente'
  }
} 