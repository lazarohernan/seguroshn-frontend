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

    // Verificamos en usuarios_corredurias (que ahora incluye superadmins)
    console.log('Verificando usuario en el sistema...');
    
    // Agregamos logs más detallados para diagnóstico
    console.log('ID del usuario autenticado:', authData.user.id);
    console.log('Email del usuario:', email);
    
    // Obtener información del usuario de la base de datos - ahora usando la vista creada
    console.log('Consultando vista de usuarios completa...');
    const usuarioQuery = supabase
      .from('vista_usuarios_completa')
      .select('*')
      .eq('correo', email)
      .eq('estado', true)
      .single();
      
    console.log('Query construido:', usuarioQuery);
    
    const { data: usuarioCorreduria, error: usuarioError } = await usuarioQuery;

    if (usuarioCorreduria) {
      console.log('Usuario encontrado en BD:', usuarioCorreduria);
    }

    if (usuarioError) {
      if (usuarioError.code !== 'PGRST116') {
        console.error('Error al verificar usuario:', usuarioError);
        console.error('Detalles completos del error:', JSON.stringify(usuarioError));
      }
      
      console.log('Usuario autenticado pero no encontrado en el sistema');
      await supabase.auth.signOut();
      localStorage.removeItem('supabase-auth');
      localStorage.removeItem('sb-access-token');
      localStorage.removeItem('sb-refresh-token');
      
      return {
        ok: false,
        message: 'No se encontró tu cuenta en el sistema.'
      };
    }

    if (!usuarioCorreduria) {
      console.error('Usuario no encontrado en el sistema');
      await supabase.auth.signOut();
      localStorage.removeItem('supabase-auth');
      localStorage.removeItem('sb-access-token');
      localStorage.removeItem('sb-refresh-token');
      
      return {
        ok: false,
        message: 'Tu cuenta no tiene permisos para acceder a esta plataforma.'
      };
    }
    
    console.log('Usuario identificado en el sistema:', usuarioCorreduria);
    
    // Determinamos el rol basado en el valor numérico
    let rolString = 'tecnico';
    const rolNum = Number(usuarioCorreduria.rol);
    
    console.log('Datos del usuario encontrado:', usuarioCorreduria);
    
    if (rolNum === 3) {
      rolString = 'superadmin';
    } else if (rolNum === 1) {
      rolString = 'admin';
    }
    
    // Retornamos con el formato correcto incluyendo todos los campos necesarios
    return {
      ok: true,
      id: authData.user.id,
      email,
      nombre: usuarioCorreduria.nombre || '',
      foto: usuarioCorreduria.foto,
      id_correduria: usuarioCorreduria.id_correduria,
      rol: rolString,
      es_primer_login: false // En este caso, no es primer login
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
