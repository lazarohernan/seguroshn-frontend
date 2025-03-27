import { supabase } from '@/lib/supabase'
import type { CreateClienteResponse, DeleteResponse, Respuesta, Cliente } from '../interfaces/cliente_interface'

export const getClientesAction = async (id_correduria: string, pagina: number, limite: number) => {
  try {
    // Calcular el rango para la paginación
    const desde = (pagina - 1) * limite
    const hasta = desde + limite - 1

    const { data, error, count } = await supabase
      .from('clientes')
      .select('*', { count: 'exact' })
      .eq('id_correduria', id_correduria)
      .range(desde, hasta)

    if (error) throw error

    return {
      ok: true,
      clientes: data || [],
      total: count || 0
    } as Respuesta
  } catch (error) {
    console.error('Error obteniendo clientes:', error)
    return {
      ok: false,
      clientes: [],
      total: 0,
      message: 'Error al obtener los clientes'
    } as Respuesta
  }
}

export const createClienteAction = async (formData: FormData) => {
  try {
    // Convertir FormData a objeto
    const clienteData: Record<string, any> = {}
    formData.forEach((value, key) => {
      clienteData[key] = value
    })

    // Manejar archivos si existen
    let avatarUrl = null
    if (formData.get('avatar') instanceof File) {
      const avatarFile = formData.get('avatar') as File
      if (avatarFile.size > 0) {
        const fileExt = avatarFile.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const { data: fileData, error: uploadError } = await supabase.storage
          .from('avatares')
          .upload(`clientes/${fileName}`, avatarFile)

        if (uploadError) throw uploadError
        avatarUrl = supabase.storage.from('avatares').getPublicUrl(`clientes/${fileName}`).data.publicUrl
      }
    }

    // Insertar cliente
    const { data, error } = await supabase
      .from('clientes')
      .insert({
        ...clienteData,
        avatar: avatarUrl || clienteData.avatar,
        fecha_creacion: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    return {
      ok: true,
      cliente: data,
      message: 'Cliente creado exitosamente'
    } as CreateClienteResponse
  } catch (error) {
    console.error('Error creando cliente:', error)
    return {
      ok: false,
      message: 'Error al crear el cliente'
    } as CreateClienteResponse
  }
}

export const updateClienteAction = async (formData: FormData) => {
  try {
    const id_cliente = formData.get('id_cliente') as string
    
    // Convertir FormData a objeto
    const clienteData: Record<string, any> = {}
    formData.forEach((value, key) => {
      if (key !== 'id_cliente') {
        clienteData[key] = value
      }
    })

    // Manejar archivos si existen
    let avatarUrl = null
    if (formData.get('avatar') instanceof File) {
      const avatarFile = formData.get('avatar') as File
      if (avatarFile.size > 0) {
        const fileExt = avatarFile.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const { data: fileData, error: uploadError } = await supabase.storage
          .from('avatares')
          .upload(`clientes/${fileName}`, avatarFile)

        if (uploadError) throw uploadError
        avatarUrl = supabase.storage.from('avatares').getPublicUrl(`clientes/${fileName}`).data.publicUrl
      }
    }

    // Actualizar cliente
    const { data, error } = await supabase
      .from('clientes')
      .update({
        ...clienteData,
        ...(avatarUrl && { avatar: avatarUrl }),
        fecha_actualizacion: new Date().toISOString()
      })
      .eq('id_cliente', id_cliente)
      .select()
      .single()

    if (error) throw error

    return {
      ok: true,
      cliente: data,
      message: 'Cliente actualizado exitosamente'
    } as CreateClienteResponse
  } catch (error) {
    console.error('Error actualizando cliente:', error)
    return {
      ok: false,
      message: 'Error al actualizar el cliente'
    } as CreateClienteResponse
  }
}

export const deleteClienteAction = async (id_cliente: string) => {
  try {
    // En lugar de eliminar, marcamos como inactivo
    const { data, error } = await supabase
      .from('clientes')
      .update({ estado: false })
      .eq('id_cliente', id_cliente)
      .select()
      .single()

    if (error) throw error

    return {
      ok: true,
      message: 'Cliente eliminado exitosamente'
    } as DeleteResponse
  } catch (error) {
    console.error('Error eliminando cliente:', error)
    return {
      ok: false,
      message: 'Error al eliminar el cliente'
    } as DeleteResponse
  }
}
