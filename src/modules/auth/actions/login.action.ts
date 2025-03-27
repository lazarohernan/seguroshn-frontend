import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/api/supabaseClient';

export interface LoginError {
  ok: boolean;
  message: string;
}

export interface LoginSuccess {
  ok: boolean;
  accessToken: string;
  refreshToken: string;
  nombre: string;
  correo: string;
  foto: string;
  id_correduria: string;
}

export const loginAction = async (
  email: string,
  password: string,
): Promise<LoginError | LoginSuccess> => {
  try {
    // Para Supabase Auth
    const authResponse = await fetch(`${SUPABASE_URL.replace('/rest/v1', '')}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        email,
        password
      })
    });
    
    if (!authResponse.ok) {
      throw new Error('Autenticación fallida');
    }
    
    const authData = await authResponse.json();
    
    // Obtener datos del usuario desde usuarios_corredurias
    const headers = {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${authData.access_token}`,
      'Content-Type': 'application/json'
    };
    
    const userResponse = await fetch(`${SUPABASE_URL}/usuarios_corredurias?correo=eq.${encodeURIComponent(email)}&estado=eq.true&select=id_usuario,nombre,correo,rol,foto`, {
      headers
    });
    
    if (!userResponse.ok) {
      throw new Error('Error al obtener datos de usuario');
    }
    
    const userData = await userResponse.json();
    
    if (!userData || userData.length === 0) {
      throw new Error('Usuario no encontrado o inactivo');
    }
    
    const user = userData[0];
    
    // Obtener correduría asociada
    const correduriaResponse = await fetch(`${SUPABASE_URL}/usuarios_por_correduria?id_usuario=eq.${user.id_usuario}&select=id_correduria`, {
      headers
    });
    
    let id_correduria = '';
    
    if (correduriaResponse.ok) {
      const corredurias = await correduriaResponse.json();
      if (corredurias && corredurias.length > 0) {
        id_correduria = corredurias[0].id_correduria;
      }
    }
    
    return {
      ok: true,
      accessToken: authData.access_token,
      refreshToken: authData.refresh_token,
      nombre: user.nombre,
      correo: user.correo,
      foto: user.foto || '',
      id_correduria: id_correduria
    };
  } catch (error) {
    console.error('Error de login:', error);
    return {
      ok: false,
      message: 'Credenciales incorrectas'
    };
  }
};
