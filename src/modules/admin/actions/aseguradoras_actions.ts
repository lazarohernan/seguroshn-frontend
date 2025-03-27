import { supabase } from '@/lib/supabase'
import type {
  Aseguradora,
  CreateAseguradoraResponse,
  DeleteResponse,
  Respuesta,
  RespuestaSimple,
} from '../interfaces/aseguradora_interface';

export const getAseguradoras = async (id_correduria: string) => {
  const { data, error } = await supabase
    .from('aseguradoras')
    .select('*')
    .eq('id_correduria', id_correduria)

  if (error) throw error
  return data
}

export const getAseguradoraAction = async (id_aseguradora: string) => {
  try {
    const { data } = await supabase
      .from('aseguradoras')
      .select('*')
      .eq('id_aseguradora', id_aseguradora)
      .single()

    return data
  } catch (error) {
    console.log(error)
    throw new Error('Error getting specific aseguradora')
  }
}

export const createAseguradora = async (aseguradora: any) => {
  const { data, error } = await supabase
    .from('aseguradoras')
    .insert(aseguradora)
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateAseguradora = async (id: string, aseguradora: any) => {
  const { data, error } = await supabase
    .from('aseguradoras')
    .update(aseguradora)
    .eq('id_aseguradora', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteAseguradora = async (id: string) => {
  const { error } = await supabase
    .from('aseguradoras')
    .delete()
    .eq('id_aseguradora', id)

  if (error) throw error
  return true
}
