import { supabase } from '@/lib/supabase'

export const getCorreduriasAction = async () => {
  try {
    const { data, error } = await supabase
      .from('corredurias')
      .select('*')
      .eq('estado', true)

    if (error) throw error

    return {
      ok: true,
      corredurias: data
    }
  } catch (error) {
    console.error('Error getting corredurias:', error)
    throw new Error('Error getting corredurias')
  }
}

export const getCorreduriaAction = async (id_correduria: string) => {
  try {
    const { data, error } = await supabase
      .from('corredurias')
      .select('*')
      .eq('id_correduria', id_correduria)
      .single()

    if (error) throw error

    return {
      ok: true,
      correduria: data
    }
  } catch (error) {
    console.error('Error getting correduria:', error)
    throw new Error('Error getting correduria')
  }
}

export const createCorreduriaAction = async (
  nombre: string,
  direccion: string,
  telefono: string,
  creado_por: string
) => {
  try {
    const { data, error } = await supabase
      .from('corredurias')
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
      correduria: data
    }
  } catch (error) {
    console.error('Error creating correduria:', error)
    throw new Error('Error creating correduria')
  }
}

export const updateCorreduriaAction = async (
  id_correduria: string,
  nombre: string,
  direccion: string,
  telefono: string,
  modificado_por: string
) => {
  try {
    const { data, error } = await supabase
      .from('corredurias')
      .update({
        nombre,
        direccion,
        telefono,
        fecha_modificado: new Date(),
        modificado_por
      })
      .eq('id_correduria', id_correduria)
      .select()
      .single()

    if (error) throw error

    return {
      ok: true,
      correduria: data
    }
  } catch (error) {
    console.error('Error updating correduria:', error)
    throw new Error('Error updating correduria')
  }
}

export const deleteCorreduriaAction = async (id_correduria: string) => {
  try {
    const { error } = await supabase
      .from('corredurias')
      .update({ estado: false })
      .eq('id_correduria', id_correduria)

    if (error) throw error

    return {
      ok: true
    }
  } catch (error) {
    console.error('Error deleting correduria:', error)
    throw new Error('Error deleting correduria')
  }
} 