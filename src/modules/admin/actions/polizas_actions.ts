import { supabase } from '@/lib/supabase'
import {
  CreatePolizaResponse,
  DeleteResponse,
  Respuesta,
  RespuestaSimple,
} from '../interfaces/polizas_interface';

export const getPolizasAction = async (id_correduria: string) => {
  try {
    const { data, error } = await supabase
      .from('polizas')
      .select('*')
      .eq('id_correduria', id_correduria)

    if (error) throw error

    return {
      ok: true,
      polizas: data
    }
  } catch (error) {
    console.error('Error getting pólizas:', error)
    throw new Error('Error getting pólizas')
  }
}

export const getPolizaAction = async (id_poliza: string) => {
  try {
    const { data, error } = await supabase
      .from('polizas')
      .select('*')
      .eq('id_poliza', id_poliza)
      .single()

    if (error) throw error

    return {
      ok: true,
      poliza: data
    }
  } catch (error) {
    console.error('Error getting póliza:', error)
    throw new Error('Error getting póliza')
  }
}

export const createPolizaAction = async (
  id_correduria: string,
  nombre: string,
  descripcion: string,
  archivo_poliza: string,
  fecha_poliza: Date,
  creado_por: string
) => {
  try {
    const { data, error } = await supabase
      .from('polizas')
      .insert([
        {
          id_correduria,
          nombre,
          descripcion,
          archivo_poliza,
          fecha_poliza,
          fecha_creado: new Date(),
          creado_por
        }
      ])
      .select()
      .single()

    if (error) throw error

    return {
      ok: true,
      poliza: data
    }
  } catch (error) {
    console.error('Error creating póliza:', error)
    throw new Error('Error creating póliza')
  }
}

export const updatePolizaAction = async (
  id_poliza: string,
  nombre: string,
  descripcion: string,
  archivo_poliza: string,
  fecha_poliza: Date,
  modificado_por: string
) => {
  try {
    const { data, error } = await supabase
      .from('polizas')
      .update({
        nombre,
        descripcion,
        archivo_poliza,
        fecha_poliza,
        fecha_modificado: new Date(),
        modificado_por
      })
      .eq('id_poliza', id_poliza)
      .select()
      .single()

    if (error) throw error

    return {
      ok: true,
      poliza: data
    }
  } catch (error) {
    console.error('Error updating póliza:', error)
    throw new Error('Error updating póliza')
  }
}

export const deletePolizaAction = async (id_poliza: string) => {
  try {
    const { error } = await supabase
      .from('polizas')
      .delete()
      .eq('id_poliza', id_poliza)

    if (error) throw error

    return {
      ok: true
    }
  } catch (error) {
    console.error('Error deleting póliza:', error)
    throw new Error('Error deleting póliza')
  }
}
