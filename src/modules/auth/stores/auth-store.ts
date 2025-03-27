import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { AuthStatus } from '../interfaces';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export const useAuthStore = defineStore('auth', () => {
  const authStatus = ref<AuthStatus>(AuthStatus.Checking);
  const session = ref<Session | null>(null);
  const userMetadata = ref<{
    nombre?: string;
    correo?: string;
    foto?: string;
    id_correduria?: string;
  } | null>(null);

  // Getters
  const isAuthenticated = computed(() => authStatus.value === AuthStatus.Authenticated);
  const isChecking = computed(() => authStatus.value === AuthStatus.Checking);
  
  // Acciones
  const setSession = async (newSession: Session) => {
    session.value = newSession;
    userMetadata.value = {
      nombre: newSession.user?.user_metadata?.full_name,
      correo: newSession.user?.email,
      foto: newSession.user?.user_metadata?.avatar_url,
      id_correduria: newSession.user?.user_metadata?.id_correduria
    };
    authStatus.value = AuthStatus.Authenticated;
  };

  const clearSession = () => {
    session.value = null;
    userMetadata.value = null;
    authStatus.value = AuthStatus.Unauthenticated;
  };

  const checkAuthStatus = async () => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (currentSession) {
        await setSession(currentSession);
        return true;
      } else {
        clearSession();
        return false;
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      clearSession();
      return false;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      clearSession();
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    }
  };

  return {
    // Estado
    authStatus,
    session,
    userMetadata,
    
    // Getters
    isAuthenticated,
    isChecking,
    
    // Computed properties para mantener compatibilidad con código existente
    nombre: computed(() => userMetadata.value?.nombre ?? ''),
    correo: computed(() => userMetadata.value?.correo ?? ''),
    foto: computed(() => userMetadata.value?.foto ?? ''),
    id_correduria: computed(() => userMetadata.value?.id_correduria ?? ''),
    
    // Acciones
    setSession,
    clearSession,
    checkAuthStatus,
    logout
  };
});
