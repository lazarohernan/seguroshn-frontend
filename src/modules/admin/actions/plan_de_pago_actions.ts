import { supabase } from '@/lib/supabase';
import {
  Respuesta,
  RespuestaSimple,
  PlanDePago
} from '../interfaces/plan_de_pago_interface';
import { v4 as uuidv4 } from 'uuid';

export const getPlanesDePagoAction = async (id_cliente: string) => {
  try {
    const { data, error, count } = await supabase
      .from('plan_de_pago')
      .select('*', { count: 'exact' })
      .eq('id_cliente', id_cliente)
      .eq('estado', true);
    
    if (error) throw error;
    
    // Transformar la respuesta al formato esperado por la interfaz
    const respuesta: Respuesta = {
      message: 'Planes de pago obtenidos correctamente',
      data: data || [],
      totalRegistros: count || 0
    };
    
    return respuesta;
  } catch (error) {
    console.error('Error al obtener planes de pago:', error);
    throw new Error('Error getting Planes de Pago');
  }
};

export const getPlanDePagoAction = async (id_plan: string) => {
  try {
    const { data, error } = await supabase
      .from('plan_de_pago')
      .select('*')
      .eq('id_plan', id_plan)
      .single();
    
    if (error) throw error;
    
    // Consultar información adicional del cliente y póliza
    const { data: clienteData } = await supabase
      .from('clientes')
      .select('nombre')
      .eq('id_cliente', data.id_cliente)
      .single();
    
    const { data: polizaData } = await supabase
      .from('polizas')
      .select('nombre')
      .eq('id_poliza', data.id_poliza)
      .single();
    
    // Agregar propiedades adicionales para la UI
    const planDePago: PlanDePago = {
      ...data,
      nombre_cliente: clienteData?.nombre || '',
      nombre_poliza: polizaData?.nombre || ''
    };
    
    // Transformar la respuesta al formato esperado por la interfaz
    const respuesta: RespuestaSimple = {
      message: 'Plan de pago obtenido correctamente',
      data: planDePago
    };
    
    return respuesta;
  } catch (error) {
    console.error('Error al obtener plan de pago específico:', error);
    throw new Error('Error getting specific plan de pago');
  }
};

export const createPlanDePagoAction = async (formData: FormData) => {
  try {
    // Extraer valores del FormData
    const idCliente = formData.get('id_cliente')?.toString();
    const idPoliza = formData.get('id_poliza')?.toString();
    const primaTotal = formData.get('prima_total') ? Number(formData.get('prima_total')) : 0;
    const plazo = formData.get('plazo') ? Number(formData.get('plazo')) : 1;
    const fechaDePago = formData.get('fecha_de_pago')?.toString() || new Date().toISOString();
    const pagoUno = formData.get('pago_uno') ? Number(formData.get('pago_uno')) : 0;
    const numeroPoliza = formData.get('numero_poliza')?.toString() || '';
    const observacion = formData.get('observacion')?.toString() || '';
    const status = formData.get('status')?.toString() || 'Activo';
    
    if (!idCliente || !idPoliza) {
      return {
        ok: false,
        message: 'Faltan datos requeridos (cliente o póliza)',
        data: null
      };
    }
    
    // Manejar archivo de póliza si existe
    let archivoPolizaUrl = '';
    const archivoPoliza = formData.get('archivo_poliza') as File | null;
    
    if (archivoPoliza && archivoPoliza instanceof File) {
      const fileExt = archivoPoliza.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `polizas/${fileName}`;
      
      // Subir archivo a Storage
      const { error: uploadError } = await supabase.storage
        .from('documentos')
        .upload(filePath, archivoPoliza);
      
      if (uploadError) throw uploadError;
      
      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from('documentos')
        .getPublicUrl(filePath);
      
      archivoPolizaUrl = urlData.publicUrl;
    }
    
    // Crear el plan de pago en la base de datos
    const nuevoPlanDePago: Partial<PlanDePago> = {
      id_cliente: idCliente,
      id_poliza: idPoliza,
      prima_total: primaTotal,
      plazo,
      fecha_de_pago: fechaDePago,
      pago_uno: pagoUno,
      numero_poliza: numeroPoliza,
      archivo_poliza: archivoPolizaUrl || null,
      observacion: observacion || null,
      status
    };
    
    const { data, error } = await supabase
      .from('plan_de_pago')
      .insert(nuevoPlanDePago)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      ok: true,
      message: 'Plan de pago creado correctamente',
      data: data as PlanDePago
    };
  } catch (error) {
    console.error('Error creando Plan de Pago:', error);
    return {
      ok: false,
      message: 'Error al agregar el registro',
      data: null
    };
  }
};

export const updatePlanDePagoAction = async (formData: FormData) => {
  //Obtener el id del plan de pago
  const idPlanDePago = formData.get('id_plan')?.toString();
  
  if (!idPlanDePago) {
    return {
      ok: false,
      message: 'ID del plan de pago no proporcionado',
      data: null
    };
  }
  
  try {
    // Preparar objeto para actualización
    const planDePagoActualizado: Partial<PlanDePago> = {};
    
    // Extraer valores del FormData
    if (formData.has('id_cliente')) {
      planDePagoActualizado.id_cliente = formData.get('id_cliente')?.toString() || '';
    }
    
    if (formData.has('id_poliza')) {
      planDePagoActualizado.id_poliza = formData.get('id_poliza')?.toString() || '';
    }
    
    if (formData.has('prima_total')) {
      planDePagoActualizado.prima_total = Number(formData.get('prima_total'));
    }
    
    if (formData.has('plazo')) {
      planDePagoActualizado.plazo = Number(formData.get('plazo'));
    }
    
    if (formData.has('fecha_de_pago')) {
      planDePagoActualizado.fecha_de_pago = formData.get('fecha_de_pago')?.toString() || '';
    }
    
    if (formData.has('pago_uno')) {
      planDePagoActualizado.pago_uno = Number(formData.get('pago_uno'));
    }
    
    if (formData.has('numero_poliza')) {
      planDePagoActualizado.numero_poliza = formData.get('numero_poliza')?.toString() || '';
    }
    
    if (formData.has('observacion')) {
      planDePagoActualizado.observacion = formData.get('observacion')?.toString() || null;
    }
    
    if (formData.has('status')) {
      planDePagoActualizado.status = formData.get('status')?.toString() || 'Activo';
    }
    
    // Manejar archivo de póliza si existe
    const archivoPoliza = formData.get('archivo_poliza') as File | null;
    if (archivoPoliza && archivoPoliza instanceof File) {
      const fileExt = archivoPoliza.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `polizas/${fileName}`;
      
      // Subir archivo a Storage
      const { error: uploadError } = await supabase.storage
        .from('documentos')
        .upload(filePath, archivoPoliza);
      
      if (uploadError) throw uploadError;
      
      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from('documentos')
        .getPublicUrl(filePath);
      
      planDePagoActualizado.archivo_poliza = urlData.publicUrl;
    }
    
    // Actualizar el plan de pago en la base de datos
    const { data, error } = await supabase
      .from('plan_de_pago')
      .update(planDePagoActualizado)
      .eq('id_plan', idPlanDePago)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      ok: true,
      message: 'Plan de pago actualizado correctamente',
      data: data as PlanDePago
    };
  } catch (error) {
    console.error('Error actualizando plan de pago:', error);
    return {
      ok: false,
      message: 'Error al actualizar el registro',
      data: null
    };
  }
};

export const deletePlanDePagoAction = async (idPlanDePago: string) => {
  try {
    // En lugar de eliminar físicamente, marcamos como inactivo
    const { error, count } = await supabase
      .from('plan_de_pago')
      .update({ estado: false })
      .eq('id_plan', idPlanDePago);
    
    if (error) throw error;
    
    return {
      ok: true,
      message: 'Plan de pago eliminado correctamente',
      cantidad: count?.toString() || '0'
    };
  } catch (error) {
    console.error('Error eliminando plan de pago:', error);
    return {
      ok: false,
      message: 'Error al borrar el registro',
      cantidad: '0'
    };
  }
};
