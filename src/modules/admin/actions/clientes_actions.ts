import { supabase } from '@/lib/supabase'

export const getClientesPorCorreduriaAction = async (id_correduria: string) => {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id_correduria', id_correduria)
      .eq('estado', true)

    if (error) throw error

    return {
      ok: true,
      clientes: data
    }
  } catch (error) {
    console.error('Error getting clientes:', error)
    throw new Error('Error getting clientes')
  }
}

export const getClienteAction = async (id_cliente: string) => {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id_cliente', id_cliente)
      .single()

    if (error) throw error

    return {
      ok: true,
      cliente: data
    }
  } catch (error) {
    console.error('Error getting cliente:', error)
    throw new Error('Error getting cliente')
  }
}

export const createClienteAction = async (
  id_correduria: string,
  nombre: string,
  direccion: string,
  telefono: string,
  correo: string,
  creado_por: string
) => {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .insert([
        {
          id_correduria,
          nombre,
          direccion,
          telefono,
          correo,
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
      cliente: data
    }
  } catch (error) {
    console.error('Error creating cliente:', error)
    throw new Error('Error creating cliente')
  }
}

export const updateClienteAction = async (
  id_cliente: string,
  nombre: string,
  direccion: string,
  telefono: string,
  correo: string,
  modificado_por: string
) => {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .update({
        nombre,
        direccion,
        telefono,
        correo,
        fecha_modificado: new Date(),
        modificado_por
      })
      .eq('id_cliente', id_cliente)
      .select()
      .single()

    if (error) throw error

    return {
      ok: true,
      cliente: data
    }
  } catch (error) {
    console.error('Error updating cliente:', error)
    throw new Error('Error updating cliente')
  }
}

export const deleteClienteAction = async (id_cliente: string) => {
  try {
    const { error } = await supabase
      .from('clientes')
      .update({ estado: false })
      .eq('id_cliente', id_cliente)

    if (error) throw error

    return {
      ok: true
    }
  } catch (error) {
    console.error('Error deleting cliente:', error)
    throw new Error('Error deleting cliente')
  }
}
