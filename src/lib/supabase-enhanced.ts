import { createClient, Session } from '@supabase/supabase-js'

// Usando constantes explícitas para evitar problemas con Vite/Vercel
const supabaseUrl = 'https://edejazcguedqylhchwjg.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkZWphemNndWVkcXlsaGNod2pnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNDE3NjEsImV4cCI6MjA1ODYxNzc2MX0.7bJlCKvbQsDRTMZOCPILaI7WGXp2nAk4x2zPMk3gL0U'

// Crear el cliente de Supabase con opciones adicionales
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-application-name': 'seguros-frontend',
      'apikey': supabaseAnonKey
    }
  }
})

/**
 * Clase que maneja el refresco de tokens de Supabase para evitar errores 401
 */
export class TokenManager {
  private static instance: TokenManager
  private isRefreshing = false
  private tokenRefreshPromise: Promise<Session | null> | null = null
  private refreshTimer: number | null = null

  private constructor() {
    this.setupAuthListener()
    this.setupProactiveRefresh()
  }

  /**
   * Obtiene la instancia única del TokenManager (patrón Singleton)
   */
  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager()
    }
    return TokenManager.instance
  }

  /**
   * Configura los listeners para eventos de autenticación
   */
  private setupAuthListener(): void {
    supabase.auth.onAuthStateChange((event, session) => {
      console.log(`Auth event: ${event}`, session ? 
        `Token expire: ${new Date((session.expires_at || 0) * 1000).toISOString()}` : '')
      
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refrescado automáticamente')
      } else if (event === 'SIGNED_OUT') {
        this.clearRefreshTimer()
      }
    })
  }

  /**
   * Configura el timer de refresco proactivo
   */
  private setupProactiveRefresh(): void {
    this.clearRefreshTimer()
    
    // Refrescar tokens cada 5 minutos si hay sesión
    this.refreshTimer = window.setInterval(async () => {
      try {
        const { data } = await supabase.auth.getSession()
        if (data.session) {
          const expiresAt = data.session.expires_at || 0
          const expirationTime = expiresAt * 1000 // convertir a milisegundos
          const tenMinutesFromNow = Date.now() + 10 * 60 * 1000
          
          if (expirationTime < tenMinutesFromNow) {
            console.log('Refrescando token proactivamente')
            await this.refreshToken()
          }
        }
      } catch (error) {
        console.error('Error en refresh proactivo:', error)
      }
    }, 5 * 60 * 1000) // Cada 5 minutos
  }

  /**
   * Limpia el timer de refresco
   */
  private clearRefreshTimer(): void {
    if (this.refreshTimer !== null) {
      window.clearInterval(this.refreshTimer)
      this.refreshTimer = null
    }
  }

  /**
   * Refresca el token de Supabase
   */
  public async refreshToken(): Promise<Session | null> {
    if (this.isRefreshing) {
      return this.tokenRefreshPromise
    }
    
    this.isRefreshing = true
    
    this.tokenRefreshPromise = supabase.auth.refreshSession()
      .then(({ data, error }) => {
        if (error) {
          console.error('Error al refrescar el token:', error)
          return null
        }
        return data.session
      })
      .finally(() => {
        this.isRefreshing = false
        this.tokenRefreshPromise = null
      })
    
    return this.tokenRefreshPromise
  }

  /**
   * Intenta ejecutar una operación y refresca el token si falla con 401
   * 
   * Detecta varios tipos de errores relacionados con autenticación:
   * - Error 401 explícito
   * - Código PGRST301 de PostgREST 
   * - Errores de JWT expirado
   * - Errores de token inválido
   */
  public async executeWithTokenRefresh<T>(operation: () => Promise<T>): Promise<T> {
    try {
      // Intentar ejecutar la operación original
      return await operation()
    } catch (error: unknown) {
      // Verificar si es un error de autenticación
      const err = error as { 
        status?: number; 
        code?: string; 
        message?: string;
        error?: string;
        error_description?: string;
      }
      
      const isAuthError = 
        // Error 401
        err.status === 401 || 
        // Error código PostgREST
        err.code === 'PGRST301' || 
        // Error JWT expirado en mensaje
        (err.message && (
          err.message.includes('JWT expired') || 
          err.message.includes('Invalid token') ||
          err.message.includes('JWT must be provided')
        )) ||
        // Error de token inválido
        (err.error === 'invalid_grant') ||
        // Error API key
        (err.message && err.message.includes('Invalid API key'));
      
      if (isAuthError) {
        console.log('Detectado error de autenticación, intentando refrescar token', err)
        
        try {
          // Intentar refrescar el token
          const session = await this.refreshToken()
          
          if (session) {
            console.log('Token refrescado exitosamente, reintentando operación')
            // Reintentar la operación original
            return await operation()
          } else {
            console.error('Fallo al refrescar el token, error de autenticación persistente')
            throw new Error('No se pudo refrescar la sesión. Inicie sesión nuevamente.')
          }
        } catch (refreshError) {
          console.error('Error crítico al refrescar token:', refreshError)
          throw new Error('Error de autenticación. Por favor, inicie sesión nuevamente.')
        }
      }
      
      // Si llegamos aquí, propagar el error original
      throw error
    }
  }
}

// Inicializar el gestor de tokens
export const tokenManager = TokenManager.getInstance()

/**
 * Función utilitaria para ejecutar operaciones de Supabase con manejo de token
 * @param operation - Función que realiza una operación de Supabase
 */
export async function withTokenRefresh<T>(operation: () => Promise<T>): Promise<T> {
  return tokenManager.executeWithTokenRefresh(operation)
}

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
