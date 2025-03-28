import { supabase } from '@/lib/supabase'

interface CheckError {
  ok: boolean
}

interface CheckSuccess {
  ok: boolean
  id_usuario?: string
}

export const checkAuthAction = async (): Promise<CheckError | CheckSuccess> => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return {
        ok: false
      }
    }

    return {
      ok: true,
      id_usuario: session.user.id
    }
  } catch (error) {
    console.error('Error al comprobar la autenticación:', error)
    return {
      ok: false
    }
  }
}
