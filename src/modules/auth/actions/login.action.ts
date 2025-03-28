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
      console.log('Sesión anterior limpiada');
      
      // Limpiar tokens en localStorage
      localStorage.removeItem('supabase-auth');
      localStorage.removeItem('sb-access-token');
      localStorage.removeItem('sb-refresh-token');
    } catch (signOutError) {
      console.warn('Error al limpiar sesión previa:', signOutError);
      // Continuamos aunque haya error limpiando la sesión
    }
    
    // Primero intentamos autenticar con Supabase Auth
    console.log('Intentando autenticar con Supabase Auth...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

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
    console.log('Verificando rol...');

    // Guardamos tokens inmediatamente para consultas posteriores
    if (authData.session?.access_token) {
      localStorage.setItem('sb-access-token', authData.session.access_token);
    }
    if (authData.session?.refresh_token) {
      localStorage.setItem('sb-refresh-token', authData.session.refresh_token);
    }

    // Verificamos si es un superadmin
    console.log('Consultando tabla superadmins para:', email);
    const { data: superadmin, error: superadminError } = await supabase
      .from('superadmins')
      .select('*')
      .eq('email', email)
      .single()

    console.log('Respuesta de superadmin:', superadmin, superadminError);

    if (superadminError && superadminError.code !== 'PGRST116') {
      console.error('Error al verificar superadmin:', superadminError);
      throw superadminError
    }

    if (superadmin) {
      console.log('Usuario identificado como superadmin:', superadmin);
      return {
        ok: true,
        id: authData.user.id,
        email: email,
        nombre: `${superadmin.nombres} ${superadmin.apellidos}`,
        foto: superadmin.avatar,
        rol: 'superadmin',
        es_primer_login: false
      }
    }

    console.log('Verificando si es usuario de correduría...');
    // Verificamos si es un usuario de correduría (admin o técnico)
    const { data: usuarioCorreduria, error: usuarioError } = await supabase
      .from('usuarios_corredurias')
      .select('*')
      .eq('email', email)
      .single()

    console.log('Respuesta de usuario correduría:', usuarioCorreduria, usuarioError);

    // Verificamos también con el campo correo
    if (!usuarioCorreduria) {
      const { data: usuarioPorCorreo, error: correoDuriaError } = await supabase
        .from('usuarios_corredurias')
        .select('*')
        .eq('correo', email)
        .single()
        
      console.log('Búsqueda por campo correo:', usuarioPorCorreo, correoDuriaError);
      
      if (!correoDuriaError && usuarioPorCorreo) {
        console.log('Usuario identificado por campo correo');
        return {
          ok: true,
          id: authData.user.id,
          email: email,
          nombre: usuarioPorCorreo.nombres || usuarioPorCorreo.nombre,
          foto: usuarioPorCorreo.avatar || usuarioPorCorreo.foto,
          rol: usuarioPorCorreo.rol === 1 ? 'admin' : 'tecnico',
          es_primer_login: !usuarioPorCorreo.fecha_modificado
        }
      }
    }

    if (usuarioError && usuarioError.code !== 'PGRST116') {
      console.error('Error al verificar usuario de correduría:', usuarioError);
      throw usuarioError
    }

    if (usuarioCorreduria) {
      console.log('Usuario identificado como usuario de correduría');
      return {
        ok: true,
        id: authData.user.id,
        email: email,
        nombre: usuarioCorreduria.nombres || usuarioCorreduria.nombre,
        foto: usuarioCorreduria.avatar || usuarioCorreduria.foto,
        rol: usuarioCorreduria.rol === 1 ? 'admin' : 'tecnico',
        es_primer_login: !usuarioCorreduria.fecha_modificado
      }
    }

    console.log('Usuario autenticado pero sin rol asignado');
    // Si llegamos aquí, el usuario está autenticado pero no tiene rol asignado
    await supabase.auth.signOut() // Cerramos la sesión
    
    // Limpiar tokens
    localStorage.removeItem('supabase-auth');
    localStorage.removeItem('sb-access-token');
    localStorage.removeItem('sb-refresh-token');
    
    return {
      ok: false,
      message: 'Tu cuenta no tiene permisos para acceder a esta plataforma.'
    }

  } catch (error) {
    console.error('Error en login:', error)
    
    // Limpiar sesión en caso de error
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.warn('Error al limpiar sesión:', err);
    }
    
    if (error instanceof AuthError) {
      return {
        ok: false,
        message: 'Error de autenticación: ' + error.message
      }
    }
    return {
      ok: false,
      message: 'Ha ocurrido un error inesperado. Por favor, intenta de nuevo más tarde.'
    }
  }
}
