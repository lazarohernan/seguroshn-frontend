import { supabase } from '@/lib/supabase'

export const loginAction = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error
  if (!data.session) return { ok: false }

  return {
    ok: true,
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    nombre: data.user?.user_metadata?.full_name,
    correo: data.user?.email,
    foto: data.user?.user_metadata?.avatar_url,
    id_correduria: data.user?.user_metadata?.id_correduria
  }
}
