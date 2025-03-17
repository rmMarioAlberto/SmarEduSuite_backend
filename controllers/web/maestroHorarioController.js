const db = require('../../config/pg');
const client = require('../../config/mongo');
const dbName = 'SmartEduSuite';
const collectionName = 'puerta';
const jwtControl = require('../../config/jwtConfig')

exports.getHorarioMaestro = async (req, res) => {
    const { idUsuario, token } = req.body;

    if (!idUsuario) {
        return res.status(400).json({ message: 'El id del usuario es necesario' });
    }
    if (!token) {
        return res.status(400).json({ message: 'El token del usuario es necesario' });
    }

    jwtControl.validateToken(idUsuario, token, async (results) => {
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


exports.getClasesActivas = async (req, res) => {
    const { idUsuario, token } = req.body;

    if (!idUsuario) {
        return res.status(400).json({ message: 'El id del usuario es necesario' });
    }
    if (!token) {
        return res.status(400).json({ message: 'El token del usuario es necesario' });
    }

    jwtControl.validateToken(idUsuario, token, async (results) => {
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

                // Combinar los datos de MongoDB y la base de datos relacional
                const combinedData = {
                    ...activeClasses[0], // Datos de MongoDB
                    ...results.rows[0]   // Datos de la base de datos relacional
                };

                return res.status(200).json(combinedData);
            });

        } catch (err) {
            console.error('Error en la consulta de clases activas:', err);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    });
};

const getDayOfWeek = () => {
    const now = new Date();
    return (now.getDay() + 6) % 7 + 1;
};