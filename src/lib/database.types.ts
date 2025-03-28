export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      usuarios_corredurias: {
        Row: {
          id_usuario: string
          correo: string
          nombres: string
          apellidos: string
          telefono: string
          id_correduria: string
          estado: boolean
          fecha_creado: string
          fecha_modificado: string | null
          auth_id: string
          avatar: string | null
          rol: number
        }
        Insert: {
          id_usuario?: string
          correo: string
          nombres: string
          apellidos: string
          telefono: string
          id_correduria: string
          estado?: boolean
          fecha_creado?: string
          fecha_modificado?: string | null
          auth_id: string
          avatar?: string | null
          rol?: number
        }
        Update: {
          id_usuario?: string
          correo?: string
          nombres?: string
          apellidos?: string
          telefono?: string
          id_correduria?: string
          estado?: boolean
          fecha_creado?: string
          fecha_modificado?: string | null
          auth_id?: string
          avatar?: string | null
          rol?: number
        }
      }
      clientes: {
        Row: {
          id_cliente: string
          nombre: string
          apellido: string
          telefono: string
          correo: string
          direccion: string
          fecha_nacimiento: string
          id_correduria: string
          estado: boolean
          fecha_creado: string
          fecha_modificado: string | null
        }
        Insert: {
          id_cliente?: string
          nombre: string
          apellido: string
          telefono: string
          correo: string
          direccion: string
          fecha_nacimiento: string
          id_correduria: string
          estado?: boolean
          fecha_creado?: string
          fecha_modificado?: string | null
        }
        Update: {
          id_cliente?: string
          nombre?: string
          apellido?: string
          telefono?: string
          correo?: string
          direccion?: string
          fecha_nacimiento?: string
          id_correduria?: string
          estado?: boolean
          fecha_creado?: string
          fecha_modificado?: string | null
        }
      }
      polizas: {
        Row: {
          id_poliza: string
          nombre: string
          descripcion: string
          id_aseguradora: string
          cobertura: string
          prima: number
          estado: boolean
          fecha_creado: string
          fecha_modificado: string | null
        }
        Insert: {
          id_poliza?: string
          nombre: string
          descripcion: string
          id_aseguradora: string
          cobertura: string
          prima: number
          estado?: boolean
          fecha_creado?: string
          fecha_modificado?: string | null
        }
        Update: {
          id_poliza?: string
          nombre?: string
          descripcion?: string
          id_aseguradora?: string
          cobertura?: string
          prima?: number
          estado?: boolean
          fecha_creado?: string
          fecha_modificado?: string | null
        }
      }
      aseguradoras: {
        Row: {
          id_aseguradora: string
          nombre: string
          descripcion: string
          logo: string | null
          tel_gestor: string | null
          estado: boolean
          fecha_creado: string
          fecha_modificado: string | null
        }
        Insert: {
          id_aseguradora?: string
          nombre: string
          descripcion: string
          logo?: string | null
          tel_gestor?: string | null
          estado?: boolean
          fecha_creado?: string
          fecha_modificado?: string | null
        }
        Update: {
          id_aseguradora?: string
          nombre?: string
          descripcion?: string
          logo?: string | null
          tel_gestor?: string | null
          estado?: boolean
          fecha_creado?: string
          fecha_modificado?: string | null
        }
      }
      planes_de_pago: {
        Row: {
          id_plan: string
          id_poliza: string
          id_cliente: string
          prima_total: number
          prima_mensual: number
          fecha_inicio: string
          fecha_fin: string
          estado: boolean
          fecha_creado: string
          fecha_modificado: string | null
        }
        Insert: {
          id_plan?: string
          id_poliza: string
          id_cliente: string
          prima_total: number
          prima_mensual: number
          fecha_inicio: string
          fecha_fin: string
          estado?: boolean
          fecha_creado?: string
          fecha_modificado?: string | null
        }
        Update: {
          id_plan?: string
          id_poliza?: string
          id_cliente?: string
          prima_total?: number
          prima_mensual?: number
          fecha_inicio?: string
          fecha_fin?: string
          estado?: boolean
          fecha_creado?: string
          fecha_modificado?: string | null
        }
      }
      pagos: {
        Row: {
          id_pago: string
          id_plan: string
          monto: number
          fecha_pago: string
          estado: boolean
          fecha_creado: string
          fecha_modificado: string | null
        }
        Insert: {
          id_pago?: string
          id_plan: string
          monto: number
          fecha_pago: string
          estado?: boolean
          fecha_creado?: string
          fecha_modificado?: string | null
        }
        Update: {
          id_pago?: string
          id_plan?: string
          monto?: number
          fecha_pago?: string
          estado?: boolean
          fecha_creado?: string
          fecha_modificado?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
