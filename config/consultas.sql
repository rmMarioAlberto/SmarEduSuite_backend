/*vistas*/
CREATE OR REPLACE VIEW vista_alumnos_completa AS
SELECT 
    usuario.id AS idusuario,
    usuario.nombre || ' ' || usuario."apellidoMa" || ' ' || usuario."apellidoPa" AS nombrecompletousuario,
    usuario.correo AS correousuario,
    usuario."idGrupo" AS idgrupo,
    (SELECT grupo.nombre 
     FROM grupo 
     WHERE grupo.id = usuario."idGrupo") AS nombregrupo,
    (SELECT carrera.nombre 
     FROM carrera 
     WHERE carrera.id = (SELECT grupo."idCarrera" 
                         FROM grupo 
                         WHERE grupo.id = usuario."idGrupo")) AS nombrecarrera,
    (SELECT grupo."idCarrera" 
     FROM grupo 
     WHERE grupo.id = usuario."idGrupo") AS idcarrera,
     usuario.status as usuariostatus
FROM usuario
WHERE usuario.tipo = 1
ORDER BY usuario."idGrupo";

SELECT * FROM vista_alumnos_completa 

SELECT 
    grupo.id AS "idGrupo",
    grupo.nombre AS "nombreGrupo",
    carrera.id AS "idCarrera",
    carrera.nombre AS "nombreCarrera",
    COUNT(usuario.id) AS "totalUsuarios",
    STRING_AGG(usuario.nombre || ' ' || usuario."apellidoMa" || ' ' || usuario."apellidoPa", ', ') AS "nombresCompletoUsuarios"
FROM grupo
INNER JOIN usuario ON usuario."idGrupo" = grupo.id
INNER JOIN carrera ON grupo."idCarrera" = carrera.id
WHERE usuario.status = 1 AND usuario.tipo = 1
GROUP BY grupo.id, grupo.nombre, carrera.id, carrera.nombre
HAVING COUNT(usuario.id) >= 1
ORDER BY grupo.id;

CREATE OR REPLACE VIEW get_grupos_carrera AS
SELECT 
    grupo.id AS "grupoId",
    string_agg(grupo.nombre || '(' || carrera.nombre || ')', ', ') AS grupo_carrera
FROM grupo
INNER JOIN carrera ON grupo."idCarrera" = carrera.id
GROUP BY grupo.id, grupo.nombre, carrera.nombre;

SELECT * FROM get_grupos_carrera;

/*Procedimietos almacenados*/

CREATE OR REPLACE FUNCTION get_alumno_by_id(p_id_alumno INTEGER)
RETURNS TABLE (
    idusuario INTEGER,
    nombreCompletoUsuario TEXT,
    nombreUsuario VARCHAR,
    apellidoMaUsuario VARCHAR,
    apellidoPaUsuario VARCHAR,
    correoUsuario VARCHAR,
    idGrupo INTEGER,
    nombreGrupo VARCHAR,
    idCarrera INTEGER,
    nombreCarrera VARCHAR,
    usuarioStatus INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v.idusuario,
        v.nombrecompletousuario,
        u.nombre AS nombreUsuario,
        u."apellidoMa" AS apellidoMaUsuario,
        u."apellidoPa" AS apellidoPaUsuario,
        v.correousuario,
        v.idgrupo,
        v.nombregrupo,
        v.idcarrera,
        v.nombrecarrera,
        v.usuariostatus
    FROM vista_alumnos_completa v
    INNER JOIN usuario u ON v.idusuario = u.id
    WHERE v.idusuario = p_id_alumno;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM get_alumno_by_id(51);


CREATE OR REPLACE FUNCTION search_alumno(p_busqueda TEXT)
RETURNS TABLE (
    idusuario INTEGER,
    nombrecompletousuario TEXT,
    correousuario VARCHAR,
    idgrupo INTEGER,
    nombregrupo VARCHAR,
    idcarrera INTEGER,
    nombrecarrera VARCHAR,
    usuariostatus INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v.idusuario,
        v.nombrecompletousuario,
        v.correousuario,
        v.idgrupo,
        v.nombregrupo,
        v.idcarrera,
        v.nombrecarrera,
        v.usuariostatus
    FROM vista_alumnos_completa v
    WHERE v.nombrecompletousuario ILIKE '%' || p_busqueda || '%'
    ORDER BY v.idgrupo, v.nombrecompletousuario;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM search_alumno('k');

/*trigers*/




/*Consultas*/
CREATE OR REPLACE VIEW get_clases as
SELECT 
    c.id as idclase,
    c.status as statusclase,
    c.inicio as inicoclase,
    c.final as finalclase,
    c.dia as diaclase,
    c."idUsuarioMaestro" as idmaestroclase,
    c."idGrupo" as idgrupo,
    c."idMateria" as idmateria,
    c."idSalon" as idsalon,
    string_agg(u.nombre || ' ' || u."apellidoMa" || ' ' || u."apellidoPa", ', ') as nombremaestro,
    g.nombre as gruponombre,
    g."idCarrera" as idcarrera,
    m.nombre as nombremateria,
    s.nombre as nombresalon,
    s.edificio as nombreedificio
FROM 
    clase c
LEFT JOIN 
    usuario u ON c."idUsuarioMaestro" = u.id
LEFT JOIN 
    grupo g ON c."idGrupo" = g.id
LEFT JOIN 
    materia m ON c."idMateria" = m.id
LEFT JOIN 
    salon s ON c."idSalon" = s.id
GROUP BY 
    c.id,
    c.status,
    c.inicio,
    c.final,
    c.dia,
    c."idUsuarioMaestro",
    c."idGrupo",
    c."idMateria",
    c."idSalon",
    g.id,
    g.nombre,
    g."idCarrera",
    m.id,
    m.nombre,
    s.nombre,
    s.edificio;

SELECT * from get_clases WHERE idclase = 1 ORDER BY idclase;

 select * from clase;



DROP PROCEDURE verificar_disponibilidad_salon;
CREATE OR REPLACE PROCEDURE verificar_disponibilidad_salon(
    p_id_salon INT,
    p_dia INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_horas_disponibles TEXT := '';
    v_hora INTEGER;
    v_salon_activo BOOLEAN;
BEGIN
    -- Verificar si el salón está activo
    SELECT EXISTS (
        SELECT 1
        FROM salon
        WHERE id = p_id_salon AND status = 1
    ) INTO v_salon_activo;
    
    -- Si el salón no está activo, devolver mensaje
    IF NOT v_salon_activo THEN
        RAISE NOTICE 'El salón % no está activo.', p_id_salon;
        RETURN;
    END IF;
    
    -- Verificar si hay clases programadas para el salón y el día especificados
    IF NOT EXISTS (
        SELECT 1
        FROM clase c
        WHERE c."idSalon" = p_id_salon
          AND c.dia = p_dia
    ) THEN
        -- Si no hay clases, todas las horas están disponibles
        FOR v_hora IN 7..20 LOOP
            v_horas_disponibles := v_horas_disponibles || 
                LPAD(v_hora::TEXT, 2, '0') || ':00:00, ';
        END LOOP;
    ELSE
        -- Si hay clases, verificar cada hora entre 7 AM y 8 PM
        FOR v_hora IN 7..20 LOOP
            -- Verificar si hay clases programadas en esa hora
            IF NOT EXISTS (
                SELECT 1
                FROM clase c
                WHERE c."idSalon" = p_id_salon
                  AND c.dia = p_dia
                  AND (
                      (c.inicio < make_time(v_hora + 1, 0, 0) AND c.final > make_time(v_hora, 0, 0))
                  )
            ) THEN
                -- Si no hay clases, agregar la hora a las horas disponibles
                v_horas_disponibles := v_horas_disponibles || 
                    LPAD(v_hora::TEXT, 2, '0') || ':00:00, ';
            END IF;
        END LOOP;
    END IF;

    -- Eliminar la última coma y espacio
    IF v_horas_disponibles <> '' THEN
        v_horas_disponibles := left(v_horas_disponibles, length(v_horas_disponibles) - 2);
    END IF;

    -- Devolver las horas disponibles
    IF v_horas_disponibles = '' THEN
        RAISE NOTICE 'No hay horas disponibles para el salón % en el día %.', p_id_salon, p_dia;
    ELSE
        RAISE NOTICE 'Horas disponibles para el salón % en el día %: %', p_id_salon, p_dia, v_horas_disponibles;
    END IF;
END;
$$;
CALL verificar_disponibilidad_salon(1, 1);  -- Ejemplo: salón 1, martes (2)


CREATE OR REPLACE FUNCTION verificar_disponibilidad_salon_2(
    p_id_salon INT,
    p_dia INT
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    resultado JSON;
BEGIN
    WITH salon_info AS (
        SELECT id, nombre, status
        FROM salon
        WHERE id = p_id_salon
    ),
    salon_status AS (
        SELECT 
            CASE 
                WHEN COUNT(*) = 0 THEN 'no_existe'
                WHEN MAX(status) != 1 THEN 'inactivo'
                ELSE 'activo'
            END AS estado,
            MAX(nombre) AS nombre
        FROM salon_info
    ),
    todas_horas AS (
        SELECT generate_series(7, 20) AS hora
    ),
    clases_dia AS (
        SELECT 
            EXTRACT(HOUR FROM inicio)::INT AS hora_inicio,
            EXTRACT(HOUR FROM final)::INT AS hora_final
        FROM clase 
        WHERE "idSalon" = p_id_salon 
        AND dia = p_dia
        AND status = 1
    ),
    horas_ocupadas AS (
        SELECT DISTINCT th.hora
        FROM todas_horas th
        JOIN clases_dia cd ON 
            th.hora >= cd.hora_inicio AND th.hora < cd.hora_final
    ),
    horas_disponibilidad AS (
        SELECT 
            th.hora,
            CASE WHEN ho.hora IS NULL THEN true ELSE false END AS disponible
        FROM todas_horas th
        LEFT JOIN horas_ocupadas ho ON th.hora = ho.hora
    )
    SELECT 
        CASE 
            WHEN ss.estado = 'no_existe' THEN
                json_build_object(
                    'success', false,
                    'message', 'El salón no existe',
                    'salon_id', p_id_salon,
                    'dia', p_dia,
                    'horas_disponibles', '[]'::JSON
                )
            WHEN ss.estado = 'inactivo' THEN
                json_build_object(
                    'success', false,
                    'message', 'El salón no está activo',
                    'salon_id', p_id_salon,
                    'salon_nombre', ss.nombre,
                    'dia', p_dia,
                    'horas_disponibles', '[]'::JSON
                )
            ELSE
                json_build_object(
                    'success', true,
                    'salon_id', p_id_salon,
                    'salon_nombre', ss.nombre,
                    'dia', p_dia,
                    'horas_disponibles', (
                        SELECT json_agg(
                            json_build_object(
                                'hora', hd.hora,
                                'hora_formato', hd.hora || ':00:00',
                                'disponible', hd.disponible
                            )
                        )
                        FROM horas_disponibilidad hd
                    )
                )
        END INTO resultado
    FROM salon_status ss;

    RETURN resultado;
END;
$$;

SELECT verificar_disponibilidad_salon_2(1, 2);


select * from grupo;




/*triggers*/


-- Primero, creamos la función que será llamada por el trigger
CREATE OR REPLACE FUNCTION sincronizar_status_alumnos_con_grupo()
RETURNS TRIGGER AS $$
BEGIN
    -- Verifica si el status del grupo ha cambiado
    IF NEW.status <> OLD.status THEN
        -- Actualiza el status de todos los alumnos del grupo para que coincida con el nuevo status del grupo
        UPDATE usuario
        SET status = NEW.status
        WHERE "idGrupo" = NEW.id;
        
        -- Opcional: Registrar el cambio en una tabla de logs o mostrar una notificación
        RAISE NOTICE 'Se actualizó el status de los alumnos del grupo % de % a %', 
                     NEW.id, OLD.status, NEW.status;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Luego, creamos el trigger que ejecutará la función
CREATE TRIGGER sincronizar_status_alumnos_con_grupo
AFTER UPDATE OF status ON grupo
FOR EACH ROW
WHEN (NEW.status <> OLD.status)
EXECUTE FUNCTION sincronizar_status_alumnos_con_grupo();

DROP Trigger sincronizar_status_alumnos_con_grupo on grupo;

drop FUNCTION sincronizar_status_alumnos_con_grupo;

-- Desactivar un grupo (status = 0)
UPDATE grupo SET status = 0 WHERE id = 2;

-- Verificar que los alumnos del grupo también se desactivaron
SELECT * FROM usuario WHERE "idGrupo" = 2;

-- Activar el grupo nuevamente (status = 1)
UPDATE grupo SET status = 1 WHERE id = 2;

-- Verificar que los alumnos del grupo también se activaron
SELECT * FROM usuario WHERE "idGrupo" = 2;