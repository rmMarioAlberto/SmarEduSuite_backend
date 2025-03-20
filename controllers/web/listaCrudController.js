const db = require('../../config/pg');
const client = require('../../config/mongo');
const { DatabaseError } = require('pg');
const dbname = 'SmartEduSuite';
const coleccion = 'listas';
const jtwControl = require('../../config/jwtConfig')

exports.listas = (req, res) => {
    const { idUsuario, token, startDate, endDate, idGrupo } = req.body
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