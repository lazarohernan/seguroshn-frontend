import { supabase } from '@/lib/supabase'
import type { Poliza, Respuesta, CreatePolizaResponse, DeleteResponse } from '../interfaces/polizas_interface'

export const getPolizasAction = async (id_correduria: string, pagina: number, limite: number) => {
  try {
    // Calcular el rango para la paginación
    const desde = (pagina - 1) * limite
    const hasta = desde + limite - 1

    const { data, error, count } = await supabase
      .from('polizas')
      .select(`
        *,
        clientes(*),
        aseguradoras(*)
      `, { count: 'exact' })
      .eq('id_correduria', id_correduria)
      .range(desde, hasta)

    if (error) throw error

    // Calcular paginación
    const totalPaginas = Math.ceil((count || 0) / limite)

    return {
      ok: true,
      data: data || [],
      totalRegistros: count || 0,
      paginaActual: pagina,
      totalPaginas,
      limite
    }
  } catch (error) {
    console.error('Error obteniendo pólizas:', error)
    return {
      ok: false,
      data: [],
      totalRegistros: 0,
      paginaActual: pagina,
      totalPaginas: 0,
      limite,
      message: 'Error al obtener las pólizas'
    }
  }
}

export const getPolizaAction = async (id_poliza: string) => {
  try {
    const { data } = await supabase
      .from('polizas')
      .select('*')
      .eq('id_poliza', id_poliza)
      .single()

    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Error getting specific póliza');
  }
};

export const createPolizaAction = async (formData: FormData) => {
  try {
    // Convertir FormData a objeto
    const polizaData: Record<string, any> = {}
    formData.forEach((value, key) => {
      if (key !== 'archivo_poliza') {
        polizaData[key] = value
      }
    })

    // Manejar archivo si existe
    let archivoUrl = null
    if (formData.get('archivo_poliza') instanceof File) {
      const polizaFile = formData.get('archivo_poliza') as File
      if (polizaFile.size > 0) {
        const fileExt = polizaFile.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('polizas')
          .upload(`documentos/${fileName}`, polizaFile)

        if (uploadError) throw uploadError
        archivoUrl = supabase.storage.from('polizas').getPublicUrl(`documentos/${fileName}`).data.publicUrl
      }
    }

    // Insertar póliza
    const { data, error } = await supabase
      .from('polizas')
      .insert({
        ...polizaData,
        archivo_poliza: archivoUrl,
        fecha_creacion: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    return {
      ok: true,
      poliza: data,
      message: 'Póliza creada exitosamente'
    }
  } catch (error) {
    console.error('Error creando póliza:', error)
    return {
      ok: false,
      message: 'Error al crear la póliza'
    }
  }
}

export const updatePolizaAction = async (formData: FormData) => {
  try {
    const id_poliza = formData.get('id_poliza') as string
    
    // Convertir FormData a objeto
    const polizaData: Record<string, any> = {}
    formData.forEach((value, key) => {
      if (key !== 'id_poliza' && key !== 'archivo_poliza') {
        polizaData[key] = value
      }
    })

    // Manejar archivo si existe
    let archivoUrl = null
    if (formData.get('archivo_poliza') instanceof File) {
      const polizaFile = formData.get('archivo_poliza') as File
      if (polizaFile.size > 0) {
        const fileExt = polizaFile.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('polizas')
          .upload(`documentos/${fileName}`, polizaFile)

        if (uploadError) throw uploadError
        archivoUrl = supabase.storage.from('polizas').getPublicUrl(`documentos/${fileName}`).data.publicUrl
      }
    }

    // Actualizar póliza
    const { data, error } = await supabase
      .from('polizas')
      .update({
        ...polizaData,
        ...(archivoUrl && { archivo_poliza: archivoUrl }),
        fecha_actualizacion: new Date().toISOString()
      })
      .eq('id_poliza', id_poliza)
      .select()
      .single()

    if (error) throw error

    return {
      ok: true,
      poliza: data,
      message: 'Póliza actualizada exitosamente'
    }
  } catch (error) {
    console.error('Error actualizando póliza:', error)
    return {
      ok: false,
      message: 'Error al actualizar la póliza'
    }
  }
}

export const deletePolizaAction = async (id_poliza: string) => {
  try {
    // En lugar de eliminar, marcamos como inactiva
    const { data, error } = await supabase
      .from('polizas')
      .update({ estado: false })
      .eq('id_poliza', id_poliza)
      .select()
      .single()

    if (error) throw error

    return {
      ok: true,
      message: 'Póliza eliminada exitosamente'
    }
  } catch (error) {
    console.error('Error eliminando póliza:', error)
    return {
      ok: false,
      message: 'Error al eliminar la póliza'
    }
  }
}
