const jwtControl = require('../../config/jwtConfig')
const db = require('../../config/pg');

//Consulta tadas las materias
exports.getMaterias = (req, res) => {
    const { id, token } = req.body;

    jwtControl.validateToken(id, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        const query = 'SELECT * FROM materia ORDER BY id';

        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            return res.status(200).json(results.rows);
        });
    });
};

// Consulta materias por id
exports.getMateriaById = (req, res) => {
    const { idMateria, idUsuario, token } = req.body;

    jwtControl.validateToken(idUsuario, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        if (!idMateria) {
            return res.status(400).json({ message: 'Id de materia es requerido' });
        }

        const query = 'SELECT * FROM materia WHERE id = $1';

        db.query(query, [idMateria], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            if (results.rows.length === 0) {
                return res.status(404).json({ message: 'Materia no encontrada' });
            }

            return res.status(200).json(results.rows[0]);
        });
    });
};

// Agrega materias
exports.addMateria = (req, res) => {
    const { nombre, status, idUsuario, token } = req.body;

    jwtControl.validateToken(idUsuario, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        if (!nombre) {
            return res.status(400).json({ message: 'El nombre de la materia es requerido' });
        }

        if (!status) {
            return res.status(400).json({ message: 'El status de la materia es requerido' });
        }

        const query = 'INSERT INTO materia (nombre, status) VALUES ($1, $2)';

        db.query(query, [nombre, status], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            return res.status(200).json({ message: 'Materia agregada exitosamente' });
        });
    });
};

// actualiza materias
exports.updateMateria = (req, res) => {
    const { nombre, status, idMateria, idUsuario, token } = req.body;

    jwtControl.validateToken(idUsuario, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        if (!nombre) {
            return res.status(400).json({ message: 'El nombre de la materia es requerido' });
        }

        if (!status) {
            return res.status(400).json({ message: 'El status de la materia es requerido' });
        }

        if (!idMateria) {
            return res.status(400).json({ message: 'El id de la materia es requerido' });
        }

        const query = 'UPDATE materia SET nombre = $1, status = $2 WHERE id = $3';

        db.query(query, [nombre, status, idMateria], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            if (results.rowCount === 0) {
                return res.status(404).json({ message: 'Materia no encontrada' });
            }

            return res.status(200).json({ message: 'Materia actualizada exitosamente' });
        });
    });
};

// buscar materias
exports.searchMateria = (req, res) => {
    const { nombre, idUsuario, token } = req.body;

    jwtControl.validateToken(idUsuario, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        if (!nombre) {
            return res.status(400).json({ message: 'Nombre de materia es requerido' });
        }

        const query = 'SELECT * FROM materia WHERE nombre ILIKE $1 ORDER BY id';
        const searchValue = `%${nombre}%`;

        db.query(query, [searchValue], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            if (results.rows.length === 0) {
                return res.status(404).json({ message: 'Materia no encontrada' });
            }

            return res.status(200).json(results.rows);
        });
    });
};