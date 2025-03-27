export const handleAuthError = (error: any): string => {
  if (!error) return 'Error desconocido'

  // Errores específicos de Supabase
  if (error.message?.toLowerCase().includes('invalid login credentials')) {
    return 'Credenciales inválidas'
  }
  if (error.message?.toLowerCase().includes('email not confirmed')) {
    return 'Por favor confirma tu correo electrónico'
  }
  if (error.message?.toLowerCase().includes('invalid email')) {
    return 'Correo electrónico inválido'
  }
  if (error.message?.toLowerCase().includes('password')) {
    return 'La contraseña debe tener al menos 6 caracteres'
  }
  if (error.message?.toLowerCase().includes('rate limit')) {
    return 'Demasiados intentos. Por favor espera unos minutos'
  }

  // Error genérico
  return error.message || 'Error de autenticación'
} 