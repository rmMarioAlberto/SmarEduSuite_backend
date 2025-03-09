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
CALL verificar_disponibilidad_salon(1, 2);  -- Ejemplo: salón 1, martes (2)
