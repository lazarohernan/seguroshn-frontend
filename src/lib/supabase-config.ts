/**
 * Configuración centralizada para Supabase
 * Este archivo gestiona la configuración de Supabase adaptada para distintos entornos
 */
import { SupabaseClientOptions } from '@supabase/supabase-js';

// Determinar el entorno actual
export const isProduction = import.meta.env.PROD;
export const isDevelopment = import.meta.env.DEV;
export const isVercel = typeof window !== 'undefined' && window.location.host.includes('vercel.app');

// URLs y claves de Supabase
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Función para obtener el token de acceso actual
const getAccessToken = () => {
  if (typeof window === 'undefined') return supabaseAnonKey;
  return localStorage.getItem('sb-access-token') || supabaseAnonKey;
};

// Crear la configuración del cliente Supabase con tipos correctos
export const supabaseConfig: SupabaseClientOptions<"public"> = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    storageKey: 'supabase-auth',
    flowType: 'pkce',
  },
  global: {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${getAccessToken()}`,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, apikey'
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 5,
    },
  },
};

// Debug Helper (solo en desarrollo)
if (isDevelopment) {
  console.log('Supabase Config:', {
    url: supabaseUrl,
    env: isProduction ? 'production' : 'development',
    isVercel,
  });
}
