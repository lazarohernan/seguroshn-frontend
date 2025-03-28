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
    console.log('Iniciando proceso de login...');
    
    // Primero intentamos autenticar con Supabase Auth
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

    console.log('Usuario autenticado, verificando rol...');

    // Verificamos si es un superadmin
    const { data: superadmin, error: superadminError } = await supabase
      .from('superadmins')
      .select('*')
      .eq('email', email)
      .single()

    if (superadminError && superadminError.code !== 'PGRST116') {
      console.error('Error al verificar superadmin:', superadminError);
      throw superadminError
    }

    if (superadmin) {
      console.log('Usuario identificado como superadmin');
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
      .eq('correo', email)
      .single()

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
        nombre: usuarioCorreduria.nombre,
        foto: usuarioCorreduria.foto,
        rol: usuarioCorreduria.rol === 1 ? 'admin' : 'tecnico',
        es_primer_login: !usuarioCorreduria.fecha_modificado
      }
    }

    console.log('Usuario autenticado pero sin rol asignado');
    // Si llegamos aquí, el usuario está autenticado pero no tiene rol asignado
    await supabase.auth.signOut() // Cerramos la sesión
    return {
      ok: false,
      message: 'Tu cuenta no tiene permisos para acceder a esta plataforma.'
    }

  } catch (error) {
    console.error('Error en login:', error)
    if (error instanceof AuthError) {
      return {
        ok: false,
        message: 'Error de autenticación. Por favor, intenta de nuevo.'
      }
    }
    return {
      ok: false,
      message: 'Ha ocurrido un error inesperado. Por favor, intenta de nuevo más tarde.'
    }
  }
}
