export enum AuthStatus {
  Checking = 'checking',
  Authenticated = 'authenticated',
  NotAuthenticated = 'not-authenticated',
}

export interface AuthResponse {
  id: string
  email: string
  nombre: string
  foto?: string
  id_correduria?: string
}

export interface CheckStatusResponse {
  ok: boolean
  id_usuario?: string
}

export interface User {
  id: string
  email: string
  nombre: string
  foto?: string
  id_correduria?: string
}