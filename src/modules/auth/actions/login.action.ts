import { supabase } from '@/lib/supabase'
import { AuthError } from '@supabase/supabase-js'

export interface LoginError {
  ok: boolean
  message: string
}

export interface LoginSuccess {
  ok: boolean
  id: string
  email: string
  nombre: string
  foto?: string
  id_correduria?: string
  rol: string
  es_primer_login?: boolean
}

export const loginAction = async (
  email: string,
  password: string,
): Promise<LoginError | LoginSuccess> => {
  try {
    console.log('Iniciando proceso de login con:', email);
    
    // Primero verificamos directamente si el email existe en la tabla de superadmins
    // antes de hacer la autenticación
    console.log('Pre-verificando si es superadmin...');
    const { data: superadminPreCheck } = await supabase
      .from('superadmins')
      .select('email, auth_id')
      .eq('email', email)
      .eq('estado', true)
      .single();
      
    console.log('Resultado pre-verificación superadmin:', superadminPreCheck);
    
    // Si es potencialmente un superadmin, vamos a manejar el proceso de manera específica
    const isSuperadminAttempt = !!superadminPreCheck;
    
    // Limpiar cualquier sesión anterior
    try {
      await supabase.auth.signOut()
      localStorage.removeItem('supabase-auth');
      localStorage.removeItem('sb-access-token');
      localStorage.removeItem('sb-refresh-token');
    } catch (signOutError) {
      console.warn('Error al limpiar sesión previa:', signOutError);
    }
    
    // Intentamos autenticar con Supabase Auth
    console.log('Intentando autenticar con Supabase Auth...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error('Error de autenticación:', authError);
      if (authError.message === 'Invalid login credentials') {
        return {
          ok: false,
          message: 'Correo electrónico o contraseña incorrectos.'
        }
      }
      throw authError
    }

    if (!authData.user) {
      console.error('No se encontró información del usuario');
      return {
        ok: false,
        message: 'No se pudo obtener la información del usuario.'
      }
    }

    console.log('Usuario autenticado correctamente:', authData.user.id);
    
    // Guardamos tokens inmediatamente para consultas posteriores
    if (authData.session?.access_token) {
      localStorage.setItem('sb-access-token', authData.session.access_token);
    }
    if (authData.session?.refresh_token) {
      localStorage.setItem('sb-refresh-token', authData.session.refresh_token);
    }

    // Si intentamos iniciar sesión como superadmin y la autenticación fue exitosa
    if (isSuperadminAttempt) {
      console.log('Obteniendo datos completos del superadmin...');
      const { data: superadmin, error: superadminError } = await supabase
        .from('superadmins')
        .select('*')
        .eq('email', email)
        .eq('estado', true)
        .single();

      if (superadminError) {
        console.error('Error al obtener datos del superadmin:', superadminError);
        throw superadminError;
      }

      if (superadmin) {
        console.log('Usuario confirmado como superadmin:', superadmin);
        return {
          ok: true,
          id: authData.user.id,
          email,
          nombre: `${superadmin.nombres} ${superadmin.apellidos}`,
          foto: superadmin.avatar,
          rol: 'superadmin',
          es_primer_login: false
        };
      }
    }

    // Si no es superadmin o falló la verificación, continuamos con los usuarios de correduría
    console.log('Verificando si es usuario de correduría...');
    const { data: usuarioCorreduria, error: usuarioError } = await supabase
      .from('usuarios_corredurias')
      .select('*')
      .eq('correo', email)
      .eq('estado', true)
      .single();

    if (usuarioError && usuarioError.code !== 'PGRST116') {
      console.error('Error al verificar usuario de correduría:', usuarioError);
    }

    if (usuarioCorreduria) {
      console.log('Usuario identificado como usuario de correduría:', usuarioCorreduria);
      return {
        ok: true,
        id: authData.user.id,
        email,
        nombre: `${usuarioCorreduria.nombres || ''} ${usuarioCorreduria.apellidos || ''}`,
        foto: usuarioCorreduria.avatar,
        id_correduria: usuarioCorreduria.id_correduria,
        rol: usuarioCorreduria.rol === 1 ? 'admin' : 'tecnico',
        es_primer_login: !usuarioCorreduria.fecha_modificado
      };
    }

    console.log('Usuario autenticado pero sin rol asignado');
    await supabase.auth.signOut();
    localStorage.removeItem('supabase-auth');
    localStorage.removeItem('sb-access-token');
    localStorage.removeItem('sb-refresh-token');
    
    return {
      ok: false,
      message: 'Tu cuenta no tiene permisos para acceder a esta plataforma.'
    };

  } catch (error) {
    console.error('Error en login:', error);
    
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('supabase-auth');
      localStorage.removeItem('sb-access-token');
      localStorage.removeItem('sb-refresh-token');
    } catch (err) {
      console.warn('Error al limpiar sesión:', err);
    }
    
    if (error instanceof AuthError) {
      return {
        ok: false,
        message: 'Error de autenticación: ' + error.message
      };
    }
    return {
      ok: false,
      message: 'Ha ocurrido un error inesperado. Por favor, intenta de nuevo más tarde.'
    };
  }
}
