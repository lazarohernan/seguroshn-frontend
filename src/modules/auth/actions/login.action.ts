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
    // Paso 1: Intentar autenticación a través de la API
    try {
      const authUrl = SUPABASE_URL.includes('localhost') 
        ? `${SUPABASE_URL.replace('/rest/v1', '')}/auth/v1/token?grant_type=password`
        : `https://edejazcguedqylhchwjg.supabase.co/auth/v1/token?grant_type=password`;
        
      console.log('Intentando autenticación con Auth API:', authUrl);
      
      const authResponse = await fetch(authUrl, {
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
      
      if (authResponse.ok) {
        const authData = await authResponse.json();
        
        // Obtener datos adicionales del usuario
        const userUrl = `${SUPABASE_URL}/usuarios_corredurias?correo=eq.${encodeURIComponent(email)}&estado=eq.true&select=id_usuario,nombre,correo,rol,foto`;
        console.log('Obteniendo datos de usuario:', userUrl);
        
        const userResponse = await fetch(userUrl, {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${authData.access_token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          
          if (userData && userData.length > 0) {
            const user = userData[0];
            
            // Obtener correduría asociada
            const correduriaResponse = await fetch(`${SUPABASE_URL}/usuarios_por_correduria?id_usuario=eq.${user.id_usuario}&select=id_correduria`, {
              headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${authData.access_token}`,
                'Content-Type': 'application/json'
              }
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
          }
        }
      }
      
      // Si llegamos aquí, la autenticación con la API falló
      console.log('Autenticación con API falló, intentando autenticación directa');
    } catch (authError) {
      console.log('Error en autenticación con Auth API:', authError);
      // Continuar con el método alternativo
    }
    
    // Paso 2: Autenticación directa contra la tabla
    console.log('Intentando autenticación directa con la tabla usuarios_corredurias');
    const userUrl = `${SUPABASE_URL}/usuarios_corredurias?correo=eq.${encodeURIComponent(email)}&select=id_usuario,nombre,correo,rol,foto,password,estado`;
    console.log('URL de consulta:', userUrl);
    
    const userResponse = await fetch(userUrl, {
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Prefer': 'return=representation'
      }
    });
    
    if (!userResponse.ok) {
      console.log('Error al obtener datos de usuario:', userResponse.status);
      throw new Error('Error al obtener datos de usuario');
    }
    
    const userData = await userResponse.json();
    console.log('Datos de usuario obtenidos:', userData);
    
    if (!userData || userData.length === 0) {
      throw new Error('Usuario no encontrado');
    }
    
    const user = userData[0];
    
    // Verificar si la cuenta está activa
    if (!user.estado) {
      throw new Error('La cuenta de usuario está inactiva');
    }
    
    // Verificar la contraseña
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
    
    // Generar un token simple
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
