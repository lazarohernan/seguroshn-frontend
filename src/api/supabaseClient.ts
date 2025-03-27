// Este archivo sirve como punto de referencia para la URL de la API de Supabase
export const SUPABASE_URL = import.meta.env.VITE_API_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Configuramos la URL base para las llamadas API
export const API_URL = SUPABASE_URL;
