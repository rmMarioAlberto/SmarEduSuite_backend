/*vistas*/
CREATE OR REPLACE VIEW vista_alumnos_completa AS
SELECT 
    usuario.id AS "idUsuario",
    usuario.nombre || ' ' || usuario."apellidoMa" || ' ' || usuario."apellidoPa" AS "nombreCompletoUsuario",
    usuario.correo AS "correoUsuario",
    usuario."idGrupo" AS "idGrupo",
    (SELECT grupo.nombre 
     FROM grupo 
     WHERE grupo.id = usuario."idGrupo") AS "nombreGrupo",
    (SELECT carrera.nombre 
     FROM carrera 
     WHERE carrera.id = (SELECT grupo."idCarrera" 
                         FROM grupo 
                         WHERE grupo.id = usuario."idGrupo")) AS "nombreCarrera",
    (SELECT grupo."idCarrera" 
     FROM grupo 
     WHERE grupo.id = usuario."idGrupo") AS "idCarrera"
FROM usuario
WHERE usuario.status = 1 AND usuario.tipo = 1
ORDER BY usuario."idGrupo";

SELECT * FROM vista_alumnos_completa WHERE "idUsuario" = 1

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

/*Procedimietos almacenados*/

CREATE OR REPLACE FUNCTION get_alumno_by_id(p_id_alumno INTEGER)
RETURNS TABLE (
    id_usuario INTEGER,
    nombre_completo TEXT,
    correo VARCHAR,
    id_grupo INTEGER,
    nombre_grupo VARCHAR,
    id_carrera INTEGER,
    nombre_carrera VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        "idUsuario",
        "nombreCompletoUsuario",
        "correoUsuario",
        "idGrupo",
        "nombreGrupo",
        "idCarrera",
        "nombreCarrera"
    FROM vista_alumnos_completa
    WHERE "idUsuario" = p_id_alumno;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM get_alumno_by_id(51);


CREATE OR REPLACE FUNCTION search_alumno(p_busqueda TEXT)
RETURNS TABLE (
    id_usuario INTEGER,
    nombre_completo TEXT,
    correo VARCHAR,
    id_grupo INTEGER,
    nombre_grupo VARCHAR,
    id_carrera INTEGER,
    nombre_carrera VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        "idUsuario",
        "nombreCompletoUsuario",
        "correoUsuario",
        "idGrupo",
        "nombreGrupo",
        "idCarrera",
        "nombreCarrera"
    FROM vista_alumnos_completa
    WHERE "nombreCompletoUsuario" ILIKE '%' || p_busqueda || '%'
    ORDER BY "idGrupo", "nombreCompletoUsuario";
END;
$$ LANGUAGE plpgsql;

SELECT * FROM search_alumno('');


/*trigers*/