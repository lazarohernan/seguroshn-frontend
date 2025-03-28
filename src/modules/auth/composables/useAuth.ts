import { supabase } from '@/lib/supabase'

/**
 * Obtiene el token de sesión actual
 */
export function getAccessToken() {
  return supabase.auth.getSession().then(({ data: { session } }) => session?.access_token)
}

/**
 * Obtiene el refreshToken del localStorage
 */
export function getRefreshToken() {
  return localStorage.getItem('refreshToken')
}

/**
 * Refresca el accessToken usando el refreshToken
 */
export async function refreshAccessToken() {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession()
    
    if (error) throw error
    
    if (session?.access_token) {
      return session.access_token
    } else {
      throw new Error('No se pudo renovar el token')
    }
  } catch (error) {
    console.error('Error al renovar token:', error)
    // Redirigir al login
    window.location.href = '/auth/login'
  }
}

/**
 * Cierra sesión y elimina los tokens
 */
export function logout() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  window.location.href = '/login'
}