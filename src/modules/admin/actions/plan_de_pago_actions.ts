import { supabase } from '@/lib/supabase'

export const getPlanesDePagoAction = async (id_cliente: string) => {
  try {
    const { data, error } = await supabase
      .from('plan_de_pago')
      .select('*')
      .eq('id_cliente', id_cliente)
      .eq('estado', true)

    if (error) throw error

    return {
      ok: true,
      planes: data
    }
  } catch (error) {
    console.error('Error getting planes de pago:', error)
    throw new Error('Error getting planes de pago')
  }
}

export const getPlanDePagoAction = async (id_plan: string) => {
  try {
    const { data, error } = await supabase
      .from('plan_de_pago')
      .select('*')
      .eq('id_plan', id_plan)
      .single()

    if (error) throw error

    return {
      ok: true,
      plan: data
    }
  } catch (error) {
    console.error('Error getting plan de pago:', error)
    throw new Error('Error getting plan de pago')
  }
}

export const createPlanDePagoAction = async (
  id_cliente: string,
  id_poliza: string,
  prima_total: number,
  plazo: number,
  fecha_de_pago: Date,
  creado_por: string
) => {
  try {
    const { data, error } = await supabase
      .from('plan_de_pago')
      .insert([
        {
          id_cliente,
          id_poliza,
          prima_total,
          plazo,
          fecha_de_pago,
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
      plan: data
    }
  } catch (error) {
    console.error('Error creating plan de pago:', error)
    throw new Error('Error creating plan de pago')
  }
}

export const updatePlanDePagoAction = async (
  id_plan: string,
  prima_total: number,
  plazo: number,
  fecha_de_pago: Date,
  modificado_por: string
) => {
  try {
    const { data, error } = await supabase
      .from('plan_de_pago')
      .update({
        prima_total,
        plazo,
        fecha_de_pago,
        fecha_modificado: new Date(),
        modificado_por
      })
      .eq('id_plan', id_plan)
      .select()
      .single()

    if (error) throw error

    return {
      ok: true,
      plan: data
    }
  } catch (error) {
    console.error('Error updating plan de pago:', error)
    throw new Error('Error updating plan de pago')
  }
}

export const deletePlanDePagoAction = async (id_plan: string) => {
  try {
    const { error } = await supabase
      .from('plan_de_pago')
      .update({ estado: false })
      .eq('id_plan', id_plan)

    if (error) throw error

    return {
      ok: true
    }
  } catch (error) {
    console.error('Error deleting plan de pago:', error)
    throw new Error('Error deleting plan de pago')
  }
}
