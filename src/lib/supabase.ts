import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://edejazcguedqylhchwjg.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Crear el cliente de Supabase con opciones adicionales
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-application-name': 'seguros-frontend'
    }
  }
})

// Tipos de datos para las tablas principales
export type Tables = {
  usuarios: {
    id: string
    email: string
    nombre: string
    foto?: string
    id_correduria?: string
    created_at?: string
    updated_at?: string
  }
  correduria: {
    id: string
    nombre: string
    logo?: string
    created_at?: string
    updated_at?: string
  }
}

// Helper para obtener tipos específicos de tablas
export type TableRow<T extends keyof Tables> = Tables[T] 