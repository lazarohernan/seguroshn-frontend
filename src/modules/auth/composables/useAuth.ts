import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { withTokenRefresh, tokenManager } from '@/lib/supabase-enhanced'
import { useAuthStore } from '../stores/auth-store'
import { handleAuthError } from '../utils/error-handler'
import type { AuthError, User } from '@supabase/supabase-js'

export function useAuth() {
  const authStore = useAuthStore()
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Escuchar cambios en el estado de autenticación
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      authStore.setSession(session)
    } else if (event === 'SIGNED_OUT') {
      authStore.clearSession()
    }
  })

  const login = async (email: string, password: string) => {
    try {
      loading.value = true
      error.value = null

      // Login no requiere withTokenRefresh porque estamos obteniendo nuevos tokens
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError
      if (!data.session) throw new Error('No se pudo iniciar sesión')

      // Asegurar que el token manager está activo después del login
      console.log('Login exitoso, activando TokenManager')
      tokenManager.refreshToken()
      
      authStore.setSession(data.session)
      return true
    } catch (err) {
      console.error('Error de login:', err)
      error.value = handleAuthError(err as AuthError)
      return false
    } finally {
      loading.value = false
    }
  }

  const register = async (email: string, password: string, metadata?: { full_name?: string }) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })

      if (authError) throw authError
      if (!data.user) throw new Error('No se pudo crear el usuario')

      return true
    } catch (err) {
      error.value = handleAuthError(err as AuthError)
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      loading.value = true
      error.value = null

      const { error: authError } = await supabase.auth.signOut()
      if (authError) throw authError

      authStore.clearSession()
      return true
    } catch (err) {
      error.value = handleAuthError(err as AuthError)
      return false
    } finally {
      loading.value = false
    }
  }

  const getCurrentUser = async (): Promise<User | null> => {
    try {
      // Usar withTokenRefresh para manejar automáticamente errores 401
      const { data, error: authError } = await withTokenRefresh(() => 
        supabase.auth.getUser()
      )
      
      if (authError) throw authError
      return data.user
    } catch (err) {
      console.error('Error al obtener usuario actual:', err)
      error.value = handleAuthError(err as AuthError)
      return null
    }
  }

  return {
    // Estado
    loading,
    error,
    // Métodos
    login,
    register,
    logout,
    getCurrentUser
  }
}
