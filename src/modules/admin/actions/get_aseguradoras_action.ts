import { api } from '@/api/axiosInstance';
import type { Aseguradora } from '../interfaces/aseguradora_interface';

export const getAseguradorasAction = async (
  page: number = 1,
  limit: number = 10,
  id_correduria: string,
) => {
  try {
    const { data } = await api.get<Aseguradora[]>(
      `/aseguradoras?limite=${limit}&pagina=${page}&id_correduria=${id_correduria}`,
    );

    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Error getting products');
  }
};
