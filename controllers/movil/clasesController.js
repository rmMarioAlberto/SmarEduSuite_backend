const db = require('../../config/pg');
const jwtConfig = require('../../config/jwtConfig')
const client = require('../../config/mongo');
const dbName = 'SmartEduSuite';
const collectionName = 'puerta';


exports.getClasesActivasMaestro = (req, res) => {
    const { idUsuario, tokenMovil } = req.body;

    if (!idUsuario) {
        return res.status(400).json({ message: 'El id del usuario es necesario' });
    }
    if (!tokenMovil) {
        return res.status(400).json({ message: 'El token del usuario es necesario' });
    }

    jwtConfig.validateTokenMovil(idUsuario, tokenMovil, async (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        try {
            const collection = client.db(dbName).collection(collectionName);

            // Convertir idUsuario a un número entero
            const idUsuarioInt = parseInt(idUsuario, 10);


            const activeClasses = await collection.find({
                estado: 1,
                idMaestro: idUsuarioInt
            }).toArray();

            if (activeClasses.length === 0) {
                return res.status(404).json({ message: 'No hay clases activas' });
            }

            // Si esperas solo una clase activa, accede al primer elemento
            const idClase = activeClasses[0].idClase;

            const query2 = `
                SELECT 
                    c.id AS "idclase",
                    c.inicio AS "inicioclase",
                    c.final AS "finalclase",
                    g.id AS "idgrupo",
                    g.nombre AS "gruponombre",
                    m.id AS "idmateria",
                    m.nombre AS "nombremateria",
                    s.id AS "salonid",
                    string_agg(s.nombre || ' (Edificio: ' || s.edificio || ')', ', ') AS "salonnombre"
                FROM 
                    clase c
                INNER JOIN 
                    grupo g ON g.id = c."idGrupo"
                INNER JOIN 
                    materia m ON m.id = c."idMateria"
                INNER JOIN 
                    salon s ON s.id = c."idSalon"
                WHERE 
                    c.id = $1
                GROUP BY 
                    c.id, g.id, m.id, s.id;`;

            db.query(query2, [idClase], (err, results) => {
                if (err) {
                    return res.status(500).json({ message: 'Error en el servidor', err });
                }

                const combinedData = {
                    ...activeClasses[0],
                    ...results.rows[0]
                };

                return res.status(200).json(combinedData);
            });

        } catch (err) {
            console.error('Error en la consulta de clases activas:', err);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    });
}

exports.getHorarioMaestro = async (req, res) => {
    const { idUsuario, tokenMovil } = req.body;

    if (!idUsuario) {
        return res.status(400).json({ message: 'El id del usuario es necesario' });
    }
    if (!tokenMovil) {
        return res.status(400).json({ message: 'El token del usuario es necesario' });
    }

    jwtConfig.validateTokenMovil(idUsuario, tokenMovil, async (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        const dia = getDayOfWeek();

        try {
            const query = `SELECT 
                                c.id AS "idclase",
                                c.inicio AS "inicioclase",
                                c.final AS "finalclase",
                                g.id AS "idgrupo",
                                g.nombre AS "gruponombre",
                                m.id AS "idmateria",
                                m.nombre AS "nombremateria",
                                s.id AS "salonid",
                                string_agg(s.nombre || ' (Edificio: ' || s.edificio || ')', ', ') AS "salonnombre"
                            FROM 
                                clase c
                            INNER JOIN 
                                grupo g ON g.id = c."idGrupo"
                            INNER JOIN 
                                materia m ON m.id = c."idMateria"
                            INNER JOIN 
                                salon s ON s.id = c."idSalon"
                            WHERE 
                                c."idUsuarioMaestro" = $1 AND c.dia = $2
                            GROUP BY 
                                c.id, g.id, m.id, s.id;`;
            const { rows } = await db.query(query, [idUsuario, dia]);

            res.status(200).json({ clases: rows });
        } catch (err) {
            res.status(500).json({ message: 'Error en el servidor' });
        }
    });
};

exports.getHorarioDiaAlumno = (req, res) => {
    const { idUsuario, tokenMovil } = req.body;

    if (!idUsuario) {
        return res.status(400).json({ message: 'El id usuario es necesario' })
    }

    if (!tokenMovil) {
        return res.status(400).json({ message: 'El token es necesario' })
    }

    jwtConfig.validateTokenMovil(idUsuario, tokenMovil, async (restults) => {
        if (!restults.valid) {
            return res.status(401).json({ message: 'El token no es valido o esta vencido' })
        }

        const dia = getDayOfWeek();

        try {
            // Consulta para obtener el grupo del usuario
            const queryGrupo = 'SELECT "idGrupo" FROM usuario WHERE id = $1;';
            const { rows: grupoRows } = await db.query(queryGrupo, [idUsuario]);

            if (grupoRows.length === 0) {
                return res.status(400).json({ message: "Grupo no encontrado" });
            }

            const grupoId = grupoRows[0].idGrupo;

            // Consulta para obtener las clases
            const queryClases = `
                    SELECT 
                        c.id AS "idclase",
                        c.inicio AS "inicioclase",
                        c.final AS "finalclase",
                        g.id AS "idgrupo",
                        g.nombre AS "gruponombre",
                        m.id AS "idmateria",
                        m.nombre AS "nombremateria",
                        s.id AS "salonid",
                        string_agg(s.nombre || ' (Edificio: ' || s.edificio || ')', ', ') AS "salonnombre"
                    FROM 
                        clase c
                    INNER JOIN 
                        grupo g ON g.id = c."idGrupo"
                    INNER JOIN 
                        materia m ON m.id = c."idMateria"
                    INNER JOIN 
                        salon s ON s.id = c."idSalon"
                    WHERE 
                        c."idGrupo" = $1 AND c.dia = $2
                    GROUP BY 
                        c.id, g.id, m.id, s.id;`;

            const { rows } = await db.query(queryClases, [grupoId, dia]);

            res.status(200).json({ clases: rows });
        } catch (error) {
            console.error('Error en el servidor:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }

    })
};

exports.getClasesActivasDiaAlumno = (req, res) => {
    const { idUsuario, tokenMovil } = req.body;

    if (!idUsuario) {
        return res.status(400).json({ message: 'El id del usuario es necesario' });
    }
    if (!tokenMovil) {
        return res.status(400).json({ message: 'El token del usuario es necesario' });
    }

    jwtConfig.validateTokenMovil(idUsuario, tokenMovil, async (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        try {
            // Consulta para obtener el grupo del usuario
            const queryGrupo = 'SELECT "idGrupo" FROM usuario WHERE id = $1;';
            const { rows: grupoRows } = await db.query(queryGrupo, [idUsuario]);

            if (grupoRows.length === 0) {
                return res.status(400).json({ message: "Grupo no encontrado" });
            }

            const grupoId = grupoRows[0].idGrupo;

            const collection = client.db(dbName).collection(collectionName);

            // Convertir idUsuario a un número entero
            const idGrupo = parseInt(grupoId, 10);


            const activeClasses = await collection.find({
                estado: 1,
                idGrupo: idGrupo
            }).toArray();

            if (activeClasses.length === 0) {
                return res.status(404).json({ message: 'No hay clases activas' });
            }

            // Si esperas solo una clase activa, accede al primer elemento
            const idClase = activeClasses[0].idClase;

            const query2 = `
                SELECT 
                    c.id AS "idclase",
                    c.inicio AS "inicioclase",
                    c.final AS "finalclase",
                    g.id AS "idgrupo",
                    g.nombre AS "gruponombre",
                    m.id AS "idmateria",
                    m.nombre AS "nombremateria",
                    s.id AS "salonid",
                    string_agg(s.nombre || ' (Edificio: ' || s.edificio || ')', ', ') AS "salonnombre"
                FROM 
                    clase c
                INNER JOIN 
                    grupo g ON g.id = c."idGrupo"
                INNER JOIN 
                    materia m ON m.id = c."idMateria"
                INNER JOIN 
                    salon s ON s.id = c."idSalon"
                WHERE 
                    c.id = $1
                GROUP BY 
                    c.id, g.id, m.id, s.id;`;

            db.query(query2, [idClase], (err, results) => {
                if (err) {
                    return res.status(500).json({ message: 'Error en el servidor', err });
                }

                const combinedData = {
                    ...activeClasses[0],
                    ...results.rows[0]
                };

                return res.status(200).json(combinedData);
            });

        } catch (err) {
            console.error('Error en la consulta de clases activas:', err);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    });
}



const moment = require('moment-timezone');

const getDayOfWeek = () => {
    const nowMexico = moment().tz('America/Mexico_City');
    return (nowMexico.day() + 6) % 7 + 1;
};