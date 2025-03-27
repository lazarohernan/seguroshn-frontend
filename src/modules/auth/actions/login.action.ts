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
    // Consultar directamente la tabla usuarios_corredurias
    const userResponse = await fetch(`${SUPABASE_URL}/usuarios_corredurias?correo=eq.${encodeURIComponent(email)}&select=id_usuario,nombre,correo,rol,foto,password,estado`, {
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Prefer': 'return=representation'
      }
    });
    
    if (!userResponse.ok) {
      throw new Error('Error al obtener datos de usuario');
    }
    
    const userData = await userResponse.json();
    
    if (!userData || userData.length === 0) {
      throw new Error('Usuario no encontrado');
    }
    
    const user = userData[0];
    
    // Verificar si la cuenta está activa
    if (!user.estado) {
      throw new Error('La cuenta de usuario está inactiva');
    }
    
    // Verificar la contraseña - Para autenticación básica
    if (user.password !== password && user.password !== 'auth_password_managed') {
      throw new Error('Contraseña incorrecta');
    }
    
    // Obtener correduría asociada
    const correduriaResponse = await fetch(`${SUPABASE_URL}/usuarios_por_correduria?id_usuario=eq.${user.id_usuario}&select=id_correduria`, {
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY
      }
    });
    
    let id_correduria = '';
    
    if (correduriaResponse.ok) {
      const corredurias = await correduriaResponse.json();
      if (corredurias && corredurias.length > 0) {
        id_correduria = corredurias[0].id_correduria;
      }
    }
    
    // Generar un token simple (en un entorno real deberías usar JWT)
    const accessToken = `token_${Date.now()}_${user.id_usuario}`;
    const refreshToken = `refresh_${Date.now()}_${user.id_usuario}`;
    
    return {
      ok: true,
      accessToken: accessToken,
      refreshToken: refreshToken,
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
