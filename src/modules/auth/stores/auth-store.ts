import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { AuthStatus } from '../interfaces';
import { loginAction, registerAction } from '../actions';
import { LoginError } from '../actions/login.action';
import { supabase } from '@/lib/supabase';

export { AuthStatus };

export const useAuthStore = defineStore('auth', () => {
  const authStatus = ref<AuthStatus>(AuthStatus.Checking);
  const user = ref<{
    id: string;
    email: string;
    nombre: string;
    foto?: string;
    id_correduria?: string;
    rol: string;
    es_primer_login?: boolean;
  } | null>(null);

  // Computed
  const currentUser = computed(() => user.value);
  const isAuthenticated = computed(() => authStatus.value === AuthStatus.Authenticated);
  const isPrimerLogin = computed(() => user.value?.es_primer_login ?? false);
  const userRole = computed(() => user.value?.rol ?? '');
  const isSuperAdmin = computed(() => user.value?.rol === 'superadmin');
  const isAdmin = computed(() => user.value?.rol === 'admin');
  const isTecnico = computed(() => user.value?.rol === 'tecnico');

  // Actions
  const clearSession = async () => {
    try {
      // Primero limpiamos el estado local
      user.value = null;
      authStatus.value = AuthStatus.NotAuthenticated;
      
      // Limpiamos localStorage
      localStorage.removeItem('supabase-auth');
      localStorage.removeItem('sb-access-token');
      localStorage.removeItem('sb-refresh-token');
      
      // Finalmente cerramos sesión en Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error al limpiar la sesión:', error);
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Store: Iniciando proceso de login...');
      
      // Limpiar cualquier sesión anterior
      await clearSession();
      
      const loginResp = await loginAction(email, password);
      console.log('Store: Respuesta de loginAction:', loginResp);

      if (!loginResp.ok) {
        console.error('Store: Login fallido:', 'ok' in loginResp && !loginResp.ok ? (loginResp as LoginError).message : 'Error de autenticación');
        return false;
      }

      // Verificar que tenemos una sesión válida
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Store: Error al obtener la sesión:', sessionError);
        return false;
      }

      if (!session) {
        console.error('Store: No se pudo establecer la sesión');
        return false;
      }

      console.log('Store: Sesión establecida correctamente');

      try {
        if ('id' in loginResp) {
          console.log('Store: Procesando datos de usuario:', loginResp);
          
          user.value = {
            id: loginResp.id,
            email: loginResp.email,
            nombre: loginResp.nombre || 'Usuario',
            foto: loginResp.foto,
            id_correduria: loginResp.id_correduria,
            rol: loginResp.rol,
            es_primer_login: loginResp.es_primer_login,
          };
          
          console.log('Store: Objeto de usuario creado:', user.value);
          
          authStatus.value = AuthStatus.Authenticated;

          // Guardar tokens en localStorage
          if (session?.access_token && session?.refresh_token) {
            localStorage.setItem('sb-access-token', session.access_token);
            localStorage.setItem('sb-refresh-token', session.refresh_token);
          }

          console.log('Store: Usuario autenticado correctamente');

          // Si es primer login, redirigir a cambio de contraseña
          if (loginResp.es_primer_login) {
            return 'cambio-password';
          }
        }
      } catch (err) {
        console.error('Error en el proceso de login:', err);
        return clearSession();
      }

      return true;
    } catch (error) {
      console.error('Store: Error en login:', error);
      return clearSession();
    }
  };

  const register = async (fullName: string, email: string, password: string) => {
    const registerResp = await registerAction(fullName, email, password);
    return registerResp.ok;
  };

  const logout = async () => {
    return clearSession();
  };

  const checkAuthStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return logout();
      }

      // Verificar en vista_usuarios_completa - ahora incluye superadmins (rol = 3)
      const { data: usuarioCorreduria, error: usuarioError } = await supabase
        .from('vista_usuarios_completa')
        .select('*')
        .eq('correo', session.user.email)
        .eq('estado', true)
        .single();

      if (usuarioError) {
        if (usuarioError.code !== 'PGRST116') {
          console.error('Error al verificar estado de autenticación:', usuarioError);
        }
        return logout();
      }

      if (!usuarioCorreduria) {
        console.warn('No se encontró el usuario en la tabla de usuarios');
        return logout();
      }

      console.log('Datos del usuario recuperados:', usuarioCorreduria);

      // Determinar el rol basado en el valor numérico
      let rolString = 'tecnico';
      const rolNum = Number(usuarioCorreduria.rol);
        
      if (rolNum === 3) {
        rolString = 'superadmin';
      } else if (rolNum === 1) {
        rolString = 'admin';
      }

      user.value = {
        id: session.user.id,
        email: session.user.email!,
        nombre: usuarioCorreduria.nombre || '',
        foto: usuarioCorreduria.foto,
        id_correduria: usuarioCorreduria.id_correduria,
        rol: rolString,
        es_primer_login: false, // Por defecto se considera que no es primer login
      };
      
      authStatus.value = AuthStatus.Authenticated;
      return true;
    } catch (error) {
      console.error(error);
      return logout();
    }
  };

  return {
    // Properties
    authStatus,
    currentUser,
    isAuthenticated,
    isPrimerLogin,
    userRole,
    isSuperAdmin,
    isAdmin,
    isTecnico,

    // Methods
    login,
    register,
    logout,
    checkAuthStatus,
  };
});
