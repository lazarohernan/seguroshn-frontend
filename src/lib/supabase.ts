// Re-exportamos todas las funcionalidades de supabase-enhanced
// para mantener la compatibilidad con el código existente
import { supabase, tokenManager, withTokenRefresh } from './supabase-enhanced'
import type { Tables, TableRow } from './supabase-enhanced'

// Exportamos el cliente de Supabase optimizado con manejo de tokens
export { supabase, tokenManager, withTokenRefresh }
export type { Tables, TableRow }
