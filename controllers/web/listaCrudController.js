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
        
        if (!startDate) {
            return res.status(400).json({ message: 'La fecha de inicio es necesario' });
        }
        if (!endDate) {
            return res.status(400).json({ message: 'La fecha de termino es necesario' });
        }
        if (!idGrupo) {
            return res.status(400).json({ message: 'El id de grupo es necesario' });
        }

        try {
            const query = `
                SELECT id, string_agg(nombre || ' ' || "apellidoMa" || ' ' || "apellidoPa", ' ') AS nombre_completo
                FROM usuario
                WHERE "idGrupo" = $1
                GROUP BY id
            `;
            db.query(query, [idGrupo], async (err, results) => {
                if (err) {
                    console.error('Database Error:', err);
                    return res.status(500).json({ message: "Error en el servidor" });
                }

                if (results.rowCount === 0) {
                    return res.status(400).json({ message: 'No se encontraron alumnos' });
                }

                const alumnos = results.rows;
                const asistenciaPromises = alumnos.map(alumno => {
                    console.log('Consulting MongoDB for User:', alumno.id);
                    return client.db(dbname).collection(coleccion).find({
                        idUsuario: alumno.id.toString(), 
                        fecha: {
                            $gte: new Date(startDate), 
                            $lte: new Date(endDate) 
                        }
                    }).toArray().then(asistencias => ({
                        idUsuario: alumno.id,
                        nombreCompleto: alumno.nombre_completo,
                        asistencias: asistencias
                    }));
                });

                Promise.all(asistenciaPromises)
                    .then(resultados => {
                        return res.status(200).json(resultados);
                    })
                    .catch(err => {
                        console.error('MongoDB Error:', err);
                        return res.status(500).json({ message: "Error al consultar asistencias", error: err });
                    });
            });
        } catch (error) {
            console.error('Unexpected Error:', error);
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