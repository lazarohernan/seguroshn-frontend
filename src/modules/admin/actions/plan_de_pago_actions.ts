import { api } from '@/api/axiosInstance';
import {
  CreatePlanDePagoResponse,
  Respuesta,
  RespuestaSimple,
} from '../interfaces/plan_de_pago_interface';

export const getPlanesDePagoAction = async (id_cliente: string) => {
  try {
    const { data } = await api.get<Respuesta>(`/plan-de-pago/?id_cliente=${id_cliente}`);

    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Error getting Planes de Pago');
  }
};

export const getPlanDePagoAction = async (id_plan: string) => {
  try {
    const { data } = await api.get<RespuestaSimple>(`/plan-de-pago/${id_plan}`);

    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Error getting specific póliza');
  }
};

export const createPlanDePagoAction = async (formData: FormData) => {
  console.log('formData', formData);
  try {
    const { data } = await api.post<CreatePlanDePagoResponse>(`/plan-de-pago/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', //Necesaria para adjuntar archivos
      },
    });

    console.log('data', data);

    if (data.ok) {
      return data;
    } else {
      return {
        ok: false,
        message: 'Error al agregar el registro',
      };
    }
  } catch (error) {
    console.log(error);
    throw new Error('Error creando Plan de Pago');
  }
};

// export const updatePolizaAction = async (formData: FormData) => {
//   //Obtener el id de la póliza
//   const idPoliza = formData.get('id_poliza');
//   try {
//     const { data } = await api.put<CreatePolizaResponse>(`/polizas/${idPoliza}`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data', //Necesaria para adjuntar archivos
//       },
//     });

//     if (data.ok) {
//       return data;
//     } else {
//       return {
//         ok: false,
//         message: 'Error al actualizar el registro',
//       };
//     }
//   } catch (error) {
//     console.log(error);
//     throw new Error('Error actualizando póliza');
//   }
// };

// export const deletePolizaAction = async (idPoliza: string) => {
//   try {
//     const { data } = await api.patch<DeleteResponse>(`/polizas/${idPoliza}`);

//     if (data.ok) {
//       return data;
//     } else {
//       return {
//         ok: false,
//         message: 'Error al borrar el registro',
//       };
//     }
//   } catch (error) {
//     console.log(error);
//     throw new Error('Error borrando póliza');
//   }
// };
