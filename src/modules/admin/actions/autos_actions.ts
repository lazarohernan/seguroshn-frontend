import { supabase } from '@/lib/supabase'

export const getAutosPorClienteAction = async (id_cliente: string) => {
  try {
    const { data, error } = await supabase
      .from('autos')
      .select('*')
      .eq('id_cliente', id_cliente)
      .eq('estado', true)

    if (error) throw error

    return {
      ok: true,
      autos: data
    }
  } catch (error) {
    console.error('Error getting autos:', error)
    throw new Error('Error getting autos')
  }
}

export const getAutoAction = async (id_auto: string) => {
  try {
    const { data, error } = await supabase
      .from('autos')
      .select('*')
      .eq('id_auto', id_auto)
      .single()

    if (error) throw error

    return {
      ok: true,
      auto: data
    }
  } catch (error) {
    console.error('Error getting auto:', error)
    throw new Error('Error getting auto')
  }
}

export const createAutoAction = async (
  id_cliente: string,
  marca: string,
  modelo: string,
  anio: number,
  placa: string,
  color: string,
  creado_por: string
) => {
  try {
    const { data, error } = await supabase
      .from('autos')
      .insert([
        {
          id_cliente,
          marca,
          modelo,
          anio,
          placa,
          color,
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
      auto: data
    }
  } catch (error) {
    console.error('Error creating auto:', error)
    throw new Error('Error creating auto')
  }
}

export const updateAutoAction = async (
  id_auto: string,
  marca: string,
  modelo: string,
  anio: number,
  placa: string,
  color: string,
  modificado_por: string
) => {
  try {
    const { data, error } = await supabase
      .from('autos')
      .update({
        marca,
        modelo,
        anio,
        placa,
        color,
        fecha_modificado: new Date(),
        modificado_por
      })
      .eq('id_auto', id_auto)
      .select()
      .single()

    if (error) throw error

    return {
      ok: true,
      auto: data
    }
  } catch (error) {
    console.error('Error updating auto:', error)
    throw new Error('Error updating auto')
  }
}

export const deleteAutoAction = async (id_auto: string) => {
  try {
    const { error } = await supabase
      .from('autos')
      .update({ estado: false })
      .eq('id_auto', id_auto)

    if (error) throw error

    return {
      ok: true
    }
  } catch (error) {
    console.error('Error deleting auto:', error)
    throw new Error('Error deleting auto')
  }
} 