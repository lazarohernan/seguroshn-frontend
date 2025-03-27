import { supabase } from '@/lib/supabase'
import { tokenManager } from '@/lib/supabase-enhanced'

export const loginAction = async (email: string, password: string) => {
  try {
    // El login no necesita withTokenRefresh porque estamos obteniendo nuevos tokens
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    if (!data.session) return { ok: false }

    console.log('Login exitoso, tokens obtenidos')
    
    // Aseguramos que el token manager está activo
    tokenManager.refreshToken()

    return {
      ok: true,
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      nombre: data.user?.user_metadata?.full_name,
      correo: data.user?.email,
      foto: data.user?.user_metadata?.avatar_url,
      id_correduria: data.user?.user_metadata?.id_correduria
    }
  } catch (error) {
    console.error('Error en login:', error)
    throw error
  }
}
