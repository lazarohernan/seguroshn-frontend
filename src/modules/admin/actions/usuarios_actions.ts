import { supabase } from '@/lib/supabase';
import { withTokenRefresh } from '@/lib/supabase-enhanced';
import { Respuesta, Usuario } from '../interfaces/usuarios_interface';

// Definir la estructura esperada para el objeto de usuario en la respuesta
interface UsuarioRecord {
  id_usuario?: string | null;
  correo?: string | null;
  nombre?: string | null;
  foto?: string | null;
  rol?: string | null;
}

// Definir la estructura esperada para cada registro en la respuesta
interface UsuarioCorreduriaRecord {
  usuarios: UsuarioRecord;
  id_correduria: string;
}

export const getUsuariosPorCorreduriaAction = async (id_correduria: string) => {
  try {
    // Envoltura con withTokenRefresh para manejar errores 401 y refrescar token automáticamente
    const { data, error, count } = await withTokenRefresh(async () => {
      return supabase
        .from('usuarios_por_correduria')
        .select('usuarios(id_usuario, correo, nombre, foto, rol), id_correduria', { count: 'exact' })
        .eq('id_correduria', id_correduria);
    });
    
    if (error) throw error;
    
    // Verificar que data no sea null
    if (!data) {
      return {
        message: 'No se encontraron usuarios',
        totalRegistros: 0,
        data: []
      };
    }
    
    // Usar un enfoque más seguro con type assertion secuencial
    const usuarios: Usuario[] = [];
    
    // Procesar cada elemento con chequeo de seguridad
    for (const item of data) {
      // Primero convertimos a unknown para un casting seguro
      const record = item as unknown;
      
      // Luego verificamos la estructura
      if (typeof record === 'object' && record !== null) {
        const typedRecord = record as UsuarioCorreduriaRecord;
        
        if (typedRecord.usuarios && typedRecord.id_correduria) {
          usuarios.push({
            id_usuario: String(typedRecord.usuarios.id_usuario || ''),
            correo: String(typedRecord.usuarios.correo || ''),
            nombre: String(typedRecord.usuarios.nombre || ''),
            foto: String(typedRecord.usuarios.foto || ''),
            rol: String(typedRecord.usuarios.rol || ''),
            id_correduria: String(typedRecord.id_correduria)
          });
        }
      }
    }
    
    // Construir la respuesta en el formato esperado
    const respuesta: Respuesta = {
      message: 'Usuarios obtenidos correctamente',
      totalRegistros: count || usuarios.length,
      data: usuarios
    };
    
    return respuesta;
  } catch (error) {
    console.error('Error getting Usuarios por Correduría:', error);
    throw new Error('Error getting Usuarios por Correduría');
  }
};
