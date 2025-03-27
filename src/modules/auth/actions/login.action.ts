import { SUPABASE_URL, SUPABASE_ANON_KEY, supabaseAuth } from '@/api/supabaseClient';

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
    console.log('Iniciando autenticación con Supabase Auth');
    
    // Usar el cliente de supabaseAuth para iniciar sesión
    const authData = await supabaseAuth.signIn(email, password);
    
    if (!authData || !authData.access_token) {
      throw new Error('Fallo de autenticación: No se recibió token');
    }
    
    // Obtener datos adicionales del usuario
    console.log('Obteniendo datos de usuario');
    
    const userResponse = await fetch(
      `${SUPABASE_URL}/usuarios_corredurias?correo=eq.${encodeURIComponent(email)}&estado=eq.true&select=id_usuario,nombre,correo,rol,foto`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${authData.access_token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!userResponse.ok) {
      throw new Error(`Error al obtener datos de usuario: ${userResponse.status}`);
    }
    
    const userData = await userResponse.json();
    
    if (!userData || userData.length === 0) {
      throw new Error('Usuario no encontrado o inactivo');
    }
    
    const user = userData[0];
    
    // Obtener correduría asociada
    console.log('Obteniendo información de correduría');
    
    const correduriaResponse = await fetch(
      `${SUPABASE_URL}/usuarios_por_correduria?id_usuario=eq.${user.id_usuario}&select=id_correduria`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${authData.access_token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    let id_correduria = '';
    
    if (correduriaResponse.ok) {
      const corredurias = await correduriaResponse.json();
      if (corredurias && corredurias.length > 0) {
        id_correduria = corredurias[0].id_correduria;
      }
    }
    
    console.log('Autenticación exitosa');
    
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
