import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '../stores/auth-store'

export const authMiddleware = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<void> => {
  const authStore = useAuthStore()
  
  // Si estamos verificando el estado de autenticación, esperar
  if (authStore.isChecking) {
    await new Promise(resolve => setTimeout(resolve, 100))
    return authMiddleware(to, from, next)
  }

  // Verificar la sesión actual
  const { data: { session } } = await supabase.auth.getSession()
  
  // Rutas que requieren autenticación
  if (to.meta.requiresAuth) {
    if (session) {
      // Usuario autenticado, permitir acceso
      next()
    } else {
      // Usuario no autenticado, redirigir a login
      next({ name: 'login', query: { redirect: to.fullPath } })
    }
  }
  // Rutas que requieren NO estar autenticado (login, registro, etc)
  else if (to.meta.requiresGuest) {
    if (session) {
      // Usuario autenticado, redirigir a dashboard
      next({ name: 'dashboard' })
    } else {
      // Usuario no autenticado, permitir acceso
      next()
    }
  }
  // Rutas públicas
  else {
    next()
  }
} 