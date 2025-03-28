import { supabase } from '@/lib/supabase'

export const getUsuariosPorCorreduriaAction = async (id_correduria: string) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id_correduria', id_correduria)
      .eq('estado', true)

    if (error) throw error

    return {
      ok: true,
      usuarios: data
    }
  } catch (error) {
    console.error('Error getting usuarios por correduría:', error)
    throw new Error('Error getting usuarios por correduría')
  }
}

export const createUsuarioAction = async (
  id_correduria: string,
  correo: string,
  nombre: string,
  rol: string,
  foto?: string
) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .insert([
        {
          id_correduria,
          correo,
          nombre,
          rol,
          foto,
          estado: true,
          fecha_creado: new Date()
        }
      ])
      .select()
      .single()

    if (error) throw error

    return {
      ok: true,
      usuario: data
    }
  } catch (error) {
    console.error('Error creating usuario:', error)
    throw new Error('Error creating usuario')
  }
}

export const updateUsuarioAction = async (
  id_usuario: string,
  correo: string,
  nombre: string,
  rol: string,
  foto?: string
) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .update({
        correo,
        nombre,
        rol,
        foto
      })
      .eq('id_usuario', id_usuario)
      .select()
      .single()

    if (error) throw error

    return {
      ok: true,
      usuario: data
    }
  } catch (error) {
    console.error('Error updating usuario:', error)
    throw new Error('Error updating usuario')
  }
}

export const deleteUsuarioAction = async (id_usuario: string) => {
  try {
    const { error } = await supabase
      .from('usuarios')
      .update({ estado: false })
      .eq('id_usuario', id_usuario)

    if (error) throw error

    return {
      ok: true
    }
  } catch (error) {
    console.error('Error deleting usuario:', error)
    throw new Error('Error deleting usuario')
  }
}
