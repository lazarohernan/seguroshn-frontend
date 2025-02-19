import { api } from '@/api/axiosInstance';
import type { Respuesta } from '../interfaces/aseguradora_interface';

export const getAseguradorasAction = async (id_correduria: string) => {
  try {
    const { data } = await api.get<Respuesta>(`/aseguradoras/?id_correduria=${id_correduria}`);

    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Error getting products');
  }
};
