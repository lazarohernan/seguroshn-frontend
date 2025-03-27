import { supabase } from '@/lib/supabase';
import {
  RespuestaPagos,
  RespuestaPagoSimple,
  Pago
} from '../interfaces/pagos_interface';
import { v4 as uuidv4 } from 'uuid';

/**
 * Obtiene todos los pagos de un plan de pago específico
 * @param id_plan ID del plan de pago
 * @returns Lista de pagos asociados al plan
 */
export const getPagosAction = async (id_plan: string) => {
  try {
    const { data, error, count } = await supabase
      .from('pagos_de_polizas')
      .select('*', { count: 'exact' })
      .eq('id_plan', id_plan)
      .eq('estado', true);
    
    if (error) throw error;
    
    // Transformar la respuesta al formato esperado por la interfaz
    const respuesta: RespuestaPagos = {
      message: 'Pagos obtenidos correctamente',
      data: data || [],
      totalRegistros: count || 0
    };
    
    return respuesta;
  } catch (error) {
    console.error('Error al obtener los pagos:', error);
    throw new Error('Error al obtener los pagos');
  }
};

/**
 * Obtiene un pago específico por su ID
 * @param id_pago ID del pago a consultar
 * @returns Datos del pago consultado
 */
export const getPagoAction = async (id_pago: string) => {
  try {
    const { data, error } = await supabase
      .from('pagos_de_polizas')
      .select('*')
      .eq('id_pago', id_pago)
      .single();
    
    if (error) throw error;
    
    // Transformar la respuesta al formato esperado por la interfaz
    const respuesta: RespuestaPagoSimple = {
      message: 'Pago obtenido correctamente',
      data: data as Pago
    };
    
    return respuesta;
  } catch (error) {
    console.error('Error al obtener el pago específico:', error);
    throw new Error('Error al obtener el pago específico');
  }
};

/**
 * Crea un nuevo registro de pago
 * @param formData Formulario con datos del pago incluyendo posible archivo de comprobante
 * @returns Respuesta de la creación del pago
 */
export const createPagoAction = async (formData: FormData) => {
  try {
    // Verificar que id_plan esté presente
    const idPlan = formData.get('id_plan');
    if (!idPlan) {
      return {
        ok: false,
        message: 'Error: Falta el ID del plan',
        data: null,
      };
    }

    // Extraer valores del FormData
    const abono = formData.get('abono') ? Number(formData.get('abono')) : 0;
    const metodoPago = formData.get('metodo_pago')?.toString() || 'Transferencia';
    const fecha = formData.get('fecha')?.toString() || new Date().toISOString();
    
    // Manejar archivo de comprobante si existe
    let urlComprobante = '';
    const comprobante = formData.get('comprobante') as File | null;
    
    if (comprobante && comprobante instanceof File) {
      const fileExt = comprobante.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `comprobantes/${fileName}`;
      
      // Subir archivo a Storage
      const { error: uploadError } = await supabase.storage
        .from('pagos')
        .upload(filePath, comprobante);
      
      if (uploadError) throw uploadError;
      
      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from('pagos')
        .getPublicUrl(filePath);
      
      urlComprobante = urlData.publicUrl;
    }
    
    // Crear el pago en la base de datos
    const nuevoPago: Partial<Pago> = {
      id_plan: idPlan.toString(),
      abono,
      fecha,
      metodo_pago: metodoPago,
      url_comprobante: urlComprobante || undefined,
      estado: true
    };
    
    const { data, error } = await supabase
      .from('pagos_de_polizas')
      .insert(nuevoPago)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      ok: true,
      message: 'Pago registrado correctamente',
      data: data as Pago
    };
  } catch (error) {
    console.error('Error al crear pago:', error);
    return {
      ok: false,
      message: 'Error al registrar el pago',
      data: null,
    };
  }
};

/**
 * Actualiza un pago existente
 * @param id_pago ID del pago a actualizar
 * @param formData Formulario con los datos actualizados
 * @returns Respuesta de la actualización
 */
export const updatePagoAction = async (id_pago: string, formData: FormData) => {
  try {
    // Extraer valores del FormData
    const abono = formData.get('abono') ? Number(formData.get('abono')) : 0;
    const metodoPago = formData.get('metodo_pago')?.toString();
    const fecha = formData.get('fecha')?.toString();
    
    // Preparar objeto para actualización
    const pagoActualizado: Partial<Pago> = {};
    
    if (abono > 0) pagoActualizado.abono = abono;
    if (metodoPago) pagoActualizado.metodo_pago = metodoPago;
    if (fecha) pagoActualizado.fecha = fecha;
    
    // Manejar archivo de comprobante si existe
    const comprobante = formData.get('comprobante') as File | null;
    if (comprobante && comprobante instanceof File) {
      const fileExt = comprobante.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `comprobantes/${fileName}`;
      
      // Subir archivo a Storage
      const { error: uploadError } = await supabase.storage
        .from('pagos')
        .upload(filePath, comprobante);
      
      if (uploadError) throw uploadError;
      
      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from('pagos')
        .getPublicUrl(filePath);
      
      pagoActualizado.url_comprobante = urlData.publicUrl;
    }
    
    // Actualizar el pago en la base de datos
    const { data, error } = await supabase
      .from('pagos_de_polizas')
      .update(pagoActualizado)
      .eq('id_pago', id_pago)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      ok: true,
      message: 'Pago actualizado correctamente',
      data: data as Pago
    };
  } catch (error) {
    console.error('Error al actualizar pago:', error);
    return {
      ok: false,
      message: 'Error al actualizar el pago',
      data: null,
    };
  }
};

/**
 * Elimina (inactiva) un pago
 * @param id_pago ID del pago a eliminar
 * @returns Respuesta de la eliminación
 */
export const deletePagoAction = async (id_pago: string) => {
  try {
    // En lugar de eliminar físicamente, marcamos como inactivo
    const { error, count } = await supabase
      .from('pagos_de_polizas')
      .update({ estado: false })
      .eq('id_pago', id_pago);
    
    if (error) throw error;
    
    return {
      ok: true,
      message: 'Pago eliminado correctamente',
      cantidad: count?.toString() || '0'
    };
  } catch (error) {
    console.error('Error al eliminar pago:', error);
    return {
      ok: false,
      message: 'Error al eliminar el pago',
      cantidad: '0',
    };
  }
};
