const { query } = require('express');
const jwtControl = require('../../config/jwtConfig');
const db = require('../../config/pg')

exports.getGrupos = (req, res) => {
    const { id, token } = req.body;

    jwtControl.validateToken(id, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        const query = 'SELECT grupo.id AS "grupoId", grupo.nombre AS "grupoNombre", grupo.status, grupo."idCarrera", carrera.nombre AS "carreraNombre" FROM grupo INNER JOIN carrera ON grupo."idCarrera" = carrera.id ORDER BY "grupoId"'

        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            return res.status(200).json(result.rows);
        })
    })
}

exports.getGrupoById = (req, res) => {
    const { idGrupo, idUsuario, token } = req.body;

    jwtControl.validateToken(idUsuario, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        if (!idGrupo) {
            return res.status(400).json({ message: 'Id de grupo es requerido' });
        }

        const query = 'SELECT grupo.id AS "grupoId", grupo.nombre AS "grupoNombre", grupo.status, grupo."idCarrera", carrera.nombre AS "carreraNombre" FROM grupo INNER JOIN carrera ON grupo."idCarrera" = carrera.id WHERE grupo.id = $1';

        db.query(query, [idGrupo], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            if (results.rows.length === 0) {
                return res.status(404).json({ message: 'Grupo no encontrada' });
            }

            return res.status(200).json(results.rows[0]);
        });
    });

}

exports.addGrupo = (req, res) => {
    const { nombre, idCarrera, status, idUsuario, token } = req.body;

    jwtControl.validateToken(idUsuario, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        if (!nombre) {
            return res.status(400).json({ message: 'El nombre del grupo es requerido' });
        }

        if (!status) {
            return res.status(400).json({ message: 'El status del grupo es requerido' });
        }

        if (!idCarrera) {
            return res.status(400).json({ message: 'El ID de la carrera es requerido' });
        }

        const queryValidar = 'SELECT * FROM carrera WHERE id = $1';

        db.query(queryValidar, [idCarrera], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            if (results.rows.length === 0) {
                return res.status(400).json({ message: 'La carrera no existe' });
            }

            // Solo inserta el grupo si la carrera existe
            const query = 'INSERT INTO grupo (nombre, status, "idCarrera") VALUES ($1, $2, $3)';

            db.query(query, [nombre, status, idCarrera], (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error en el servidor' });
                }

                return res.status(200).json({ message: 'Grupo agregado exitosamente' });
            });
        });
    });
};

exports.updateGrupo = (req, res) => {
    const { idGrupo, nombre, status, idCarrera, token, idUsuario } = req.body;

    jwtControl.validateToken(idUsuario, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        if (!idGrupo) {
            return res.status(400).json({ message: 'El id del grupo es requerido' });
        }
        if (!nombre) {
            return res.status(400).json({ message: 'El nombre del grupo es requerido' });
        }
        if (!status) {
            return res.status(400).json({ message: 'El status del grupo es requerido' });
        }
        if (!idCarrera) {
            return res.status(400).json({ message: 'El id de la carrera es requerido' });
        }

        const queryValidar = 'SELECT * FROM carrera WHERE id = $1 AND status = 1';

        db.query(queryValidar, [idCarrera], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            if (results.rows.length === 0) {
                return res.status(400).json({ message: 'La carrera no existe o se encuentra inactiva' });
            }

            const query = 'UPDATE grupo SET nombre = $1, status = $2, "idCarrera" = $3 WHERE id = $4';

            db.query(query, [nombre, status, idCarrera, idGrupo], (err, updateResults) => {
                if (err) {
                    return res.status(500).json({ message: 'Error en el servidor' });
                }

                if (updateResults.rowCount === 0) {
                    return res.status(404).json({ message: 'Grupo no encontrado' });
                }

                return res.status(200).json({ message: 'Grupo actualizado exitosamente' });
            });
        });
    });
};


exports.searchGrupo = (req, res) => {
    const { nombre, idUsuario, token } = req.body;

    jwtControl.validateToken(idUsuario, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        if (!nombre) {
            return res.status(400).json({ message: 'Nombre del grupo es requerido' });
        }

        const query = 'SELECT grupo.id AS "grupoId", grupo.nombre AS "grupoNombre", grupo.status, grupo."idCarrera", carrera.nombre AS "carreraNombre" FROM grupo INNER JOIN carrera ON grupo."idCarrera" = carrera.id WHERE grupo.nombre ILIKE $1 ORDER BY "grupoId"';
        const searchValue = `%${nombre}%`;

        db.query(query, [searchValue], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            if (results.rows.length === 0) {
                return res.status(404).json({ message: 'Grupo no encontrado' });
            }

            return res.status(200).json(results.rows);
        });
    });
};