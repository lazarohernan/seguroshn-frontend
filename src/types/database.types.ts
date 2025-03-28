export interface Database {
  public: {
    Tables: {
      aseguradoras: {
        Row: {
          id_aseguradora: string
          id_correduria: string
          nombre: string
          nombre_gestor: string
          tel_gestor: string
          correo_gestor: string
          logo: string
          descripcion: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['aseguradoras']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['aseguradoras']['Insert']>
      }
      polizas: {
        Row: {
          id_poliza: string
          id_correduria: string
          nombre: string
          descripcion: string
          archivo_poliza: string
          id_aseguradora: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['polizas']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['polizas']['Insert']>
      }
      usuarios: {
        Row: {
          id_usuario: string
          id_correduria: string
          nombre: string
          correo: string
          rol: 'superadmin' | 'admin' | 'tecnico'
          foto: string | null
          estado: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['usuarios']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['usuarios']['Insert']>
      }
      pagos_de_polizas: {
        Row: {
          id_pago: string
          id_plan: string
          abono: number
          fecha: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['pagos_de_polizas']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['pagos_de_polizas']['Insert']>
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
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['planes_de_pago']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['planes_de_pago']['Insert']>
      }
      clientes: {
        Row: {
          id_cliente: string
          id_correduria: string
          nombre: string
          identidad: string
          telefono: string
          correo: string
          direccion: string
          foto: string | null
          estado: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['clientes']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['clientes']['Insert']>
      }
    }
  }
} 