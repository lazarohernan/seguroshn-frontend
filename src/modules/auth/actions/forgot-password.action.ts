import { supabase } from '@/lib/supabase'

export const forgotPasswordAction = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`
  })

  if (error) throw error

  return {
    ok: true,
    message: 'Se ha enviado un correo con las instrucciones para restablecer tu contraseña'
  }
} 