import { supabase } from '@/lib/supabase'

interface RegisterError {
  ok: boolean
  message: string
}

interface RegisterSuccess {
  ok: boolean
  id: string
  email: string
}

export const registerAction = async (
  fullName: string,
  email: string,
  password: string,
): Promise<RegisterError | RegisterSuccess> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre: fullName,
        },
      },
    })

    if (error) throw error

    // Crear perfil del usuario
    const { error: profileError } = await supabase.from('profiles').insert([
      {
        id: data.user!.id,
        nombre: fullName,
        email: email,
      },
    ])

    if (profileError) throw profileError

    return {
      ok: true,
      id: data.user!.id,
      email: data.user!.email!,
    }
  } catch (error) {
    console.error('Error en registro:', error)
    return {
      ok: false,
      message: 'Error al registrar usuario',
    }
  }
}
