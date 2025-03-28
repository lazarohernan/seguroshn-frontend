CREATE OR REPLACE FUNCTION auth.login(correo_in text, password_in text) 
RETURNS json 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
DECLARE
    usuario_rec record;
    token_expiry timestamp;
    refresh_token text;
BEGIN
    -- Buscar el usuario en usuarios_corredurias
    SELECT uc.* INTO usuario_rec
    FROM public.usuarios_corredurias uc
    WHERE uc.correo = correo_in AND uc.estado = true;
    
    -- Verificar si el usuario existe y autenticar
    IF FOUND THEN
        -- Comprobar si la contraseña es correcta
        -- Nota: En producción, se debería usar una verificación segura de contraseñas
        IF usuario_rec.password = password_in OR usuario_rec.password = 'auth_password_managed' THEN
            -- Generar tokens
            token_expiry := now() + interval '1 hour';
            refresh_token := gen_random_uuid()::text;
            
            -- Buscar la correduría asociada
            DECLARE
                correduria_id uuid;
                correduria_info record;
                correduria_nombre text := 'Sin Correduría';
            BEGIN
                -- Obtener la primera correduría (si existe)
                SELECT id_correduria INTO correduria_id
                FROM public.usuarios_por_correduria
                WHERE id_usuario = usuario_rec.id_usuario
                LIMIT 1;
                
                -- Obtener información de la correduría
                IF correduria_id IS NOT NULL THEN
                    SELECT nombre INTO correduria_nombre
                    FROM public.corredurias
                    WHERE id_correduria = correduria_id;
                END IF;
                
                -- Retornar información de autenticación
                RETURN json_build_object(
                    'accessToken', encode(hmac(usuario_rec.id_usuario::text || '|' || token_expiry, 'secret_key', 'sha256'), 'hex'),
                    'refreshToken', refresh_token,
                    'nombre', usuario_rec.nombre,
                    'correo', usuario_rec.correo,
                    'foto', COALESCE(usuario_rec.foto, ''),
                    'id_correduria', COALESCE(correduria_id::text, ''),
                    'correduria', correduria_nombre,
                    'rol', usuario_rec.rol
                );
            END;
        END IF;
    END IF;
    
    -- Retornar error si la autenticación falló
    RETURN json_build_object(
        'error', 'Credenciales incorrectas',
        'status', 401
    );
END;
$$;
