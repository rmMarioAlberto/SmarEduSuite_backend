const db = require('../../config/pg');
const client = require('../../config/mongo');
const dbname = 'SmartEduSuite';
const coleccion = 'listas';
const jtwControl = require('../../config/jwtConfig');

exports.listas = (req, res) => {
    const { idUsuario, token, startDate, endDate, idGrupo } = req.body;

    if (!idUsuario) {
        return res.status(400).json({ message: 'El id del usuario es necesario' });
    }
    if (!token) {
        return res.status(400).json({ message: 'El token del usuario es necesario' });
    }

    jtwControl.validateToken(idUsuario, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: 'El token ya no es válido' });
        }

        try {
            const query = 'SELECT id FROM usuario WHERE "idGrupo" = $1';
            db.query(query, [idGrupo], async (err, results) => {
                if (err) {
                    return res.status(500).json({ message: "Error en el servidor" });
                }
                if (results.rowCount === 0) {
                    return res.status(400).json({ message: 'No se encontraron alumnos' });
                }

                const alumnos = results.rows.map(row => row.id); // Obtener los IDs de los alumnos
                const asistenciaPromises = alumnos.map(alumnoId => {
                    return client.db(dbname).collection(coleccion).find({
                        idUsuario: alumnoId,
                        fecha: {
                            $gte: new Date(startDate), // Fecha de inicio
                            $lte: new Date(endDate) // Fecha de fin
                        }
                    }).toArray(); // Convertir el cursor a un array
                });

                // Esperar a que todas las consultas a MongoDB se completen
                Promise.all(asistenciaPromises)
                    .then(asistencias => {
                        // Agrupar los resultados
                        const resultados = alumnos.map((alumnoId, index) => ({
                            idUsuario: alumnoId,
                            asistencias: asistencias[index] // Asistencias del alumno
                        }));

                        return res.status(200).json(resultados);
                    })
                    .catch(err => {
                        return res.status(500).json({ message: "Error al consultar asistencias", error: err });
                    });
            });
        } catch (error) {
            return res.status(500).json(error);
        }
    });
};

exports.gruposMaestro = (req, res) => {
    const { idUsuario, token } = req.body;
    if (!idUsuario) {
        return res.status(400).json({ message: 'El id del usuario es necesario' })
    }
    if (!token) {
        return res.status(400).json({ message: 'El token del usuario es necesario' })
    }

    jtwControl.validateToken(idUsuario, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: 'El token ya no es valido' })
        }

        const query = `
                    SELECT 
                        c."idGrupo",
                        MAX(g.nombre) AS nombre
                    FROM clase c
                    INNER JOIN grupo g ON c."idGrupo" = g.id
                    WHERE c."idUsuarioMaestro" = $1
                    GROUP BY c."idGrupo";
                    `
        db.query(query, [idUsuario], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor', err })
            }

            if (results.rows === 0) {
                return res.status(400).json({ message: 'No se encontraron grupos para el maestro' })
            }

            return res.status(300).json(results.rows);
        })
    })
}