import { supabase } from '@/lib/supabase'

export const getAseguradorasAction = async () => {
  try {
    const { data, error } = await supabase
      .from('aseguradoras')
      .select('*')
      .eq('estado', true)

    if (error) throw error

    return {
      ok: true,
      aseguradoras: data
    }
  } catch (error) {
    console.error('Error getting aseguradoras:', error)
    throw new Error('Error getting aseguradoras')
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
      aseguradora: data
    }
  } catch (error) {
    console.error('Error getting aseguradora:', error)
    throw new Error('Error getting aseguradora')
  }
}

export const createAseguradoraAction = async (
  nombre: string,
  direccion: string,
  telefono: string,
  creado_por: string
) => {
  try {
    const { data, error } = await supabase
      .from('aseguradoras')
      .insert([
        {
          nombre,
          direccion,
          telefono,
          estado: true,
          fecha_creado: new Date(),
          creado_por
        }
      ])
      .select()
      .single()

    if (error) throw error

    return {
      ok: true,
      aseguradora: data
    }
  } catch (error) {
    console.error('Error creating aseguradora:', error)
    throw new Error('Error creating aseguradora')
  }
}

export const updateAseguradoraAction = async (
  id_aseguradora: string,
  nombre: string,
  direccion: string,
  telefono: string,
  modificado_por: string
) => {
  try {
    const { data, error } = await supabase
      .from('aseguradoras')
      .update({
        nombre,
        direccion,
        telefono,
        fecha_modificado: new Date(),
        modificado_por
      })
      .eq('id_aseguradora', id_aseguradora)
      .select()
      .single()

    if (error) throw error

    return {
      ok: true,
      aseguradora: data
    }
  } catch (error) {
    console.error('Error updating aseguradora:', error)
    throw new Error('Error updating aseguradora')
  }
}

export const deleteAseguradoraAction = async (id_aseguradora: string) => {
  try {
    const { error } = await supabase
      .from('aseguradoras')
      .update({ estado: false })
      .eq('id_aseguradora', id_aseguradora)

    if (error) throw error

    return {
      ok: true
    }
  } catch (error) {
    console.error('Error deleting aseguradora:', error)
    throw new Error('Error deleting aseguradora')
  }
}
