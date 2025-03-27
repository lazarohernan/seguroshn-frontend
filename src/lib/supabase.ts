import { createClient } from '@supabase/supabase-js'

// Usando constantes explícitas para evitar problemas con Vite/Vercel
const supabaseUrl = 'https://edejazcguedqylhchwjg.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkZWphemNndWVkcXlsaGNod2pnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNDE3NjEsImV4cCI6MjA1ODYxNzc2MX0.7bJlCKvbQsDRTMZOCPILaI7WGXp2nAk4x2zPMk3gL0U'

// Crear el cliente de Supabase con opciones adicionales y asegurar que API Key esté presente
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-application-name': 'seguros-frontend',
      'apikey': supabaseAnonKey // Asegurar que la apikey esté en todos los requests
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
