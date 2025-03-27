import { supabaseAuth } from '@/api/supabaseClient';

interface CheckError {
  ok: boolean;
}

interface CheckSuccess {
  ok: boolean;
  id_usuario: string;
}

export const checkAuthAction = async (): Promise<CheckError | CheckSuccess> => {
  try {
    const localAccessToken = localStorage.getItem('accessToken');
    if ((localAccessToken && localAccessToken.length === 0) || !localAccessToken) {
      return {
        ok: false,
      };
    }

    // Usar la API de Supabase directamente para verificar el token
    const userData = await supabaseAuth.getUser(localAccessToken);
    
    if (!userData || !userData.id) {
      return {
        ok: false,
      };
    }

    return {
      ok: true,
      id_usuario: userData.id,
    };
  } catch (error) {
    console.error('Error al verificar sesión:', error);
    return {
      ok: false,
    };
  }
};
