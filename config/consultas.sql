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