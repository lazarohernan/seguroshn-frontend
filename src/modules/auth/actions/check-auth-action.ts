import { supabase } from '@/lib/supabase'
import { withTokenRefresh } from '@/lib/supabase-enhanced'

export const checkAuthAction = async () => {
  try {
    // Usamos withTokenRefresh para manejar automáticamente errores 401 y refresco de token
    const { data, error } = await withTokenRefresh(() => supabase.auth.getSession())
    
    if (error) throw error
    if (!data.session) return { ok: false }
    
    return {
      ok: true,
      id_usuario: data.session.user.id,
      email: data.session.user.email
    }
  } catch (error) {
    console.error('Error al verificar autenticación:', error)
    return { ok: false }
  }
}
