// Usa la interfaz ImportMetaEnv definida en src/vite-env.d.ts

// URL de la API y clave anónima de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://edejazcguedqylhchwjg.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkZWphemNndWVkcXlsaGNod2pnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNDE3NjEsImV4cCI6MjA1ODYxNzc2MX0.7bJlCKvbQsDRTMZOCPILaI7WGXp2nAk4x2zPMk3gL0U'

// Valores para conexiones API
export const SUPABASE_URL = supabaseUrl
export const SUPABASE_ANON_KEY = supabaseAnonKey

// Cliente básico para operaciones de autenticación usando fetch API
export const supabaseAuth = {
  // Iniciar sesión
  signIn: async (email: string, password: string) => {
    const response = await fetch(`${supabaseUrl.replace('/rest/v1', '')}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey
      },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      throw new Error('Authentication failed');
    }
    
    return response.json();
  },
  
  // Obtener información del usuario
  getUser: async (token: string) => {
    const response = await fetch(`${supabaseUrl.replace('/rest/v1', '')}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': supabaseAnonKey
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to get user data');
    }
    
    return response.json();
  },
  
  // Cerrar sesión
  signOut: async (token: string) => {
    const response = await fetch(`${supabaseUrl.replace('/rest/v1', '')}/auth/v1/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': supabaseAnonKey,
        'Content-Type': 'application/json'
      }
    });
    
    return response.ok;
  }
}
