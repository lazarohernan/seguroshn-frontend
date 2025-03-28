import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'
import { supabaseUrl, supabaseAnonKey, supabaseConfig, isVercel, isDevelopment } from './supabase-config'

export type Tables = Database['public']['Tables']
export type Enums = Database['public']['Enums']

// Tipos específicos para cada tabla
export type Usuario = Tables['usuarios_corredurias']['Row']
export type Cliente = Tables['clientes']['Row']
export type Poliza = Tables['polizas']['Row']
export type Aseguradora = Tables['aseguradoras']['Row']
export type PlanDePago = Tables['planes_de_pago']['Row']
export type Pago = Tables['pagos']['Row']

// Crear el cliente Supabase con la configuración centralizada
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, supabaseConfig)

// Configuración de debug para Vercel
if (isVercel && isDevelopment) {
  console.log('🚀 Supabase client inicializado en Vercel')
  console.log('URL:', supabaseUrl)
  console.log('Auth config:', supabaseConfig.auth)
  
  // Verificar que las variables de entorno están disponibles
  const envVars = {
    'VITE_SUPABASE_URL': import.meta.env.VITE_SUPABASE_URL ? '✅ Disponible' : '❌ No disponible',
    'VITE_SUPABASE_ANON_KEY': import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Disponible' : '❌ No disponible'
  }
  console.log('Variables de entorno:', envVars)
}
