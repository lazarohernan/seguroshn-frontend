import { supabase } from '@/lib/supabase'
import {
  CreatePagoResponse,
  DeletePagoResponse,
  RespuestaPagos,
  RespuestaPagoSimple,
  UpdatePagoResponse,
} from '../interfaces/pagos_interface';

/**
 * Obtiene todos los pagos de un plan de pago específico
 * @param id_plan ID del plan de pago
 * @returns Lista de pagos asociados al plan
 */
export const getPagosAction = async (id_plan: string) => {
  try {
    const { data, error } = await supabase
      .from('pagos_de_polizas')
      .select('*')
      .eq('id_plan', id_plan)
      .order('fecha', { ascending: true })

    if (error) throw error

    return {
      ok: true,
      pagos: data
    }
  } catch (error) {
    console.error('Error getting pagos:', error)
    throw new Error('Error getting pagos')
  }
}

/**
 * Obtiene un pago específico por su ID
 * @param id_pago ID del pago a consultar
 * @returns Datos del pago consultado
 */
export const getPagoAction = async (id_pago: string) => {
  try {
    const { data } = await supabase
      .from('pagos_de_polizas')
      .select('*')
      .eq('id_pago', id_pago)
      .single()

    if (data) {
      return data;
    } else {
      throw new Error('Pago no encontrado');
    }
  } catch (error) {
    console.error('Error getting pago:', error)
    throw new Error('Error getting pago')
  }
}

/**
 * Crea un nuevo registro de pago
 * @param id_plan ID del plan de pago
 * @param abono Monto del pago
 * @param fecha Fecha del pago
 * @returns Respuesta de la creación del pago
 */
export const createPagoAction = async (
  id_plan: string,
  abono: number,
  fecha: Date
) => {
  try {
    const { data, error } = await supabase
      .from('pagos_de_polizas')
      .insert([
        {
          id_plan,
          abono,
          fecha
        }
      ])
      .select()
      .single()

    if (error) throw error

    return {
      ok: true,
      pago: data
    }
  } catch (error) {
    console.error('Error creating pago:', error)
    throw new Error('Error creating pago')
  }
}

/**
 * Actualiza un pago existente
 * @param id_pago ID del pago a actualizar
 * @param abono Monto del pago actualizado
 * @param fecha Fecha del pago actualizado
 * @returns Respuesta de la actualización
 */
export const updatePagoAction = async (
  id_pago: string,
  abono: number,
  fecha: Date
) => {
  try {
    const { data, error } = await supabase
      .from('pagos_de_polizas')
      .update({
        abono,
        fecha
      })
      .eq('id_pago', id_pago)
      .select()
      .single()

    if (error) throw error

    return {
      ok: true,
      pago: data
    }
  } catch (error) {
    console.error('Error updating pago:', error)
    throw new Error('Error updating pago')
  }
}

/**
 * Elimina (inactiva) un pago
 * @param id_pago ID del pago a eliminar
 * @returns Respuesta de la eliminación
 */
export const deletePagoAction = async (id_pago: string) => {
  try {
    const { error } = await supabase
      .from('pagos_de_polizas')
      .delete()
      .eq('id_pago', id_pago)

    if (error) throw error

    return {
      ok: true
    }
  } catch (error) {
    console.error('Error deleting pago:', error)
    throw new Error('Error deleting pago')
  }
}
