import { supabase } from '@/lib/supabase'

export interface Aseguradora {
  id_aseguradora?: string
  id_correduria: string
  nombre: string
  descripcion: string
  nombre_gestor: string
  tel_gestor: string
  correo_gestor: string
  logo?: string
  created_at?: string
  updated_at?: string
}

export const getAseguradorasAction = async (id_correduria: string) => {
  try {
    const { data, error } = await supabase
      .from('aseguradoras')
      .select('*')
      .eq('id_correduria', id_correduria)

    if (error) throw error

    return {
      ok: true,
      data
    }
  } catch (error) {
    console.error('Error al obtener aseguradoras:', error)
    return {
      ok: false,
      data: []
    }
  }
}

export const getAseguradoraAction = async (id_aseguradora: string) => {
  try {
    const { data, error } = await supabase
      .from('aseguradoras')
      .select('*')
      .eq('id_aseguradora', id_aseguradora)
      .single()

    if (error) throw error

    return {
      ok: true,
      data
    }
  } catch (error) {
    console.error('Error al obtener aseguradora:', error)
    return {
      ok: false,
      data: null
    }
  }
}

export const createAseguradoraAction = async (aseguradora: Aseguradora) => {
  try {
    const { data, error } = await supabase
      .from('aseguradoras')
      .insert(aseguradora)
      .select()

    if (error) throw error

    return {
      ok: true,
      data: data[0],
      message: 'Aseguradora creada exitosamente'
    }
  } catch (error) {
    console.error('Error al crear aseguradora:', error)
    return {
      ok: false,
      message: 'Error al crear la aseguradora'
    }
  }
}

export const updateAseguradoraAction = async (id_aseguradora: string, aseguradora: Partial<Aseguradora>) => {
  try {
    const { data, error } = await supabase
      .from('aseguradoras')
      .update({
        ...aseguradora,
        updated_at: new Date().toISOString()
      })
      .eq('id_aseguradora', id_aseguradora)
      .select()

    if (error) throw error

    return {
      ok: true,
      data: data[0],
      message: 'Aseguradora actualizada exitosamente'
    }
  } catch (error) {
    console.error('Error al actualizar aseguradora:', error)
    return {
      ok: false,
      message: 'Error al actualizar la aseguradora'
    }
  }
}

export const deleteAseguradoraAction = async (id_aseguradora: string) => {
  try {
    const { error } = await supabase
      .from('aseguradoras')
      .delete()
      .eq('id_aseguradora', id_aseguradora)

    if (error) throw error

    return {
      ok: true,
      message: 'Aseguradora eliminada exitosamente'
    }
  } catch (error) {
    console.error('Error al eliminar aseguradora:', error)
    return {
      ok: false,
      message: 'Error al eliminar la aseguradora'
    }
  }
}
