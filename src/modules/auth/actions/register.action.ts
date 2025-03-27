import { supabase } from '@/lib/supabase'

interface RegisterData {
  email: string
  password: string
  nombre: string
  id_correduria: string
}

export const registerAction = async ({ email, password, nombre, id_correduria }: RegisterData) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: nombre,
        id_correduria
      }
    }
  })

  if (error) throw error
  if (!data.user) return { ok: false }

  return {
    ok: true,
    user: data.user,
    session: data.session
  }
}
