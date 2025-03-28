import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

export type Tables = Database['public']['Tables']
export type Enums = Database['public']['Enums']

// Tipos específicos para cada tabla
export type Superadmin = Tables['superadmins']['Row']
export type Usuario = Tables['usuarios_corredurias']['Row']
export type Cliente = Tables['clientes']['Row']
export type Poliza = Tables['polizas']['Row']
export type Aseguradora = Tables['aseguradoras']['Row']
export type PlanDePago = Tables['planes_de_pago']['Row']
export type Pago = Tables['pagos']['Row']

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Función para obtener el token de acceso actual
const getAccessToken = () => {
  return localStorage.getItem('sb-access-token') || supabaseKey
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage,
    storageKey: 'supabase-auth',
    flowType: 'pkce'
  },
  global: {
    headers: {
      get apikey() {
        return supabaseKey
      },
      get Authorization() {
        return `Bearer ${getAccessToken()}`
      },
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, apikey'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
}) 