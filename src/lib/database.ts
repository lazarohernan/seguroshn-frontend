import { supabase } from './supabase'
import type { Tables } from './supabase'

export const database = {
  usuarios: {
    async getById(id: string) {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data as Tables['usuarios']
    },

    async getByEmail(email: string) {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .single()
      
      if (error) throw error
      return data as Tables['usuarios']
    },

    async update(id: string, data: Partial<Tables['usuarios']>) {
      const { data: updatedData, error } = await supabase
        .from('usuarios')
        .update(data)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return updatedData as Tables['usuarios']
    }
  },

  correduria: {
    async getById(id: string) {
      const { data, error } = await supabase
        .from('correduria')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data as Tables['correduria']
    },

    async getAll() {
      const { data, error } = await supabase
        .from('correduria')
        .select('*')
        .order('nombre')
      
      if (error) throw error
      return data as Tables['correduria'][]
    }
  }
} 