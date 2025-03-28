import { supabase } from '@/lib/supabase'

export const getArchivosPorPolizaAction = async (id_poliza: string) => {
  try {
    const { data, error } = await supabase
      .from('archivos')
      .select('*')
      .eq('id_poliza', id_poliza)
      .eq('estado', true)

    if (error) throw error

    return {
      ok: true,
      archivos: data
    }
  } catch (error) {
    console.error('Error getting archivos:', error)
    throw new Error('Error getting archivos')
  }
}

export const getArchivoAction = async (id_archivo: string) => {
  try {
    const { data, error } = await supabase
      .from('archivos')
      .select('*')
      .eq('id_archivo', id_archivo)
      .single()

    if (error) throw error

    return {
      ok: true,
      archivo: data
    }
  } catch (error) {
    console.error('Error getting archivo:', error)
    throw new Error('Error getting archivo')
  }
}

export const createArchivoAction = async (
  id_poliza: string,
  nombre: string,
  url: string,
  tipo: string,
  creado_por: string
) => {
  try {
    const { data, error } = await supabase
      .from('archivos')
      .insert([
        {
          id_poliza,
          nombre,
          url,
          tipo,
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
      archivo: data
    }
  } catch (error) {
    console.error('Error creating archivo:', error)
    throw new Error('Error creating archivo')
  }
}

export const updateArchivoAction = async (
  id_archivo: string,
  nombre: string,
  url: string,
  tipo: string,
  modificado_por: string
) => {
  try {
    const { data, error } = await supabase
      .from('archivos')
      .update({
        nombre,
        url,
        tipo,
        fecha_modificado: new Date(),
        modificado_por
      })
      .eq('id_archivo', id_archivo)
      .select()
      .single()

    if (error) throw error

    return {
      ok: true,
      archivo: data
    }
  } catch (error) {
    console.error('Error updating archivo:', error)
    throw new Error('Error updating archivo')
  }
}

export const deleteArchivoAction = async (id_archivo: string) => {
  try {
    const { error } = await supabase
      .from('archivos')
      .update({ estado: false })
      .eq('id_archivo', id_archivo)

    if (error) throw error

    return {
      ok: true
    }
  } catch (error) {
    console.error('Error deleting archivo:', error)
    throw new Error('Error deleting archivo')
  }
}

// Funciones para el manejo de archivos en el storage de Supabase
export const uploadFileAction = async (
  bucket: string,
  path: string,
  file: File
) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file)

    if (error) throw error

    return {
      ok: true,
      path: data.path
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    throw new Error('Error uploading file')
  }
}

export const deleteFileAction = async (bucket: string, path: string) => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) throw error

    return {
      ok: true
    }
  } catch (error) {
    console.error('Error deleting file:', error)
    throw new Error('Error deleting file')
  }
}

export const getFileUrlAction = async (bucket: string, path: string) => {
  try {
    const { data } = await supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return {
      ok: true,
      url: data.publicUrl
    }
  } catch (error) {
    console.error('Error getting file URL:', error)
    throw new Error('Error getting file URL')
  }
} 