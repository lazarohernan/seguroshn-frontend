import { api } from '@/api/axiosInstance';
import { Respuesta } from '../interfaces/polizas_interface';

export const getAseguradorasAction = async (id_correduria: string) => {
  try {
    const { data } = await api.get<Respuesta>(`/polizas/?id_correduria=${id_correduria}`);

    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Error getting aseguradoras');
  }
};
