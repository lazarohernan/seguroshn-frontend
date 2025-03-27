// Interfaces para los diferentes tipos de errores
interface ErrorWithMessage {
  message: string;
}

interface ErrorWithCode {
  code?: string;
  status?: number;
  error?: string;
  error_description?: string;
}

// Type guard para verificar si es un error con mensaje
function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

// Type guard para verificar si es un error con código
function isErrorWithCode(error: unknown): error is ErrorWithCode {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('code' in error || 'status' in error || 'error' in error)
  );
}

// Extraer mensaje de error, con manejo seguro de tipos
function getErrorMessage(error: unknown): string {
  if (isErrorWithMessage(error)) {
    return error.message;
  }
  
  if (isErrorWithCode(error)) {
    if (typeof error.error_description === 'string') return error.error_description;
    if (typeof error.error === 'string') return error.error;
    if (typeof error.code === 'string') return `Error: ${error.code}`;
    if (typeof error.status === 'number') return `Error de estado: ${error.status}`;
  }
  
  return String(error);
}

export const handleAuthError = (error: unknown): string => {
  if (!error) return 'Error desconocido';

  const errorMessage = getErrorMessage(error).toLowerCase();
  
  // Errores de API y conexión
  if (errorMessage.includes('invalid api key') || errorMessage.includes('api key')) {
    return 'Error de configuración del sistema (API Key inválida)';
  }
  
  if (errorMessage.includes('network') || errorMessage.includes('conexión') || 
      errorMessage.includes('connection') || errorMessage.includes('timeout')) {
    return 'Error de conexión. Verifica tu conexión a internet';
  }
  
  if (errorMessage.includes('jwt expired') || errorMessage.includes('token expired') || 
      errorMessage.includes('token invalid')) {
    return 'Sesión expirada. Por favor, inicia sesión nuevamente';
  }

  // Errores específicos de Supabase Auth
  if (errorMessage.includes('invalid login credentials')) {
    return 'El correo electrónico o contraseña son incorrectos';
  }
  
  if (errorMessage.includes('email not confirmed')) {
    return 'Por favor confirma tu correo electrónico';
  }
  
  if (errorMessage.includes('invalid email')) {
    return 'Correo electrónico inválido';
  }
  
  if (errorMessage.includes('password')) {
    return 'La contraseña debe tener al menos 6 caracteres';
  }
  
  if (errorMessage.includes('rate limit')) {
    return 'Demasiados intentos. Por favor espera unos minutos';
  }

  // Error genérico más descriptivo
  console.error('Error de autenticación no manejado:', error);
  return isErrorWithMessage(error) 
    ? error.message 
    : 'Ha ocurrido un error durante la autenticación';
};
