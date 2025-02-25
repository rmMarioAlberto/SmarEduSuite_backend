const jwtControl = require('../../config/jwtConfig');
const db = require('../../config/pg');

exports.getCarrera = (req, res) => {
    const { id, token } = req.body;

    jwtControl.validateToken(id, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        const query = 'SELECT * FROM carrera';

        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            return res.status(200).json(results.rows);
        });
    });
};

exports.getCarreraById = (req, res) => {
    const { id, token, idCarrera } = req.body;

    jwtControl.validateToken(id, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        const query = 'SELECT * FROM carrera WHERE id = $1';

        db.query(query, [idCarrera], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            if (results.rows.length === 0) {
                return res.status(404).json({ message: 'Carrera no encontrada' });
            }

            return res.status(200).json(results.rows[0]);
        });
    });
};

exports.addCarrera = (req, res) => {
    const { nombre, status, idUsuario, token } = req.body;

    jwtControl.validateToken(idUsuario, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        if (!nombre || !status) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        const query = 'INSERT INTO carrera (nombre, status) VALUES ($1, $2)';

        db.query(query, [nombre, status], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor', err });
            }

            return res.status(200).json({ message: 'Carrera agregada exitosamente' });
        });
    });
};

exports.updateCarrera = (req, res) => {
    const { idCarrera, nombre, status, idUsuario, token } = req.body;

    jwtControl.validateToken(idUsuario, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        if (!idCarrera || !nombre || !status) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        const query = 'UPDATE carrera SET nombre = $1, status = $2 WHERE id = $3';

        db.query(query, [nombre, status, idCarrera], (err, results) => {
            if (err) {
                console.error('Error al actualizar la carrera:', err);
                return res.status(500).json({ message: 'Error en el servidor', err });
            }

            if (results.rowCount === 0) {
                return res.status(404).json({ message: 'Carrera no encontrada' });
            }

            return res.status(200).json({ message: 'Carrera actualizada exitosamente' });
        });
    });
};

exports.searchCarrera = (req, res) => {
    const { nombre, idUsuario, token } = req.body;

    jwtControl.validateToken(idUsuario, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        if (!nombre) {
            return res.status(400).json({ message: 'Nombre de carrera es requerido' });
        }

        const query = 'SELECT * FROM carrera WHERE nombre ILIKE $1';
        const searchValue = `%${nombre}%`;

        db.query(query, [searchValue], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            if (results.rows.length === 0) {
                return res.status(404).json({ message: 'Carrera no encontrada' });
            }

            return res.status(200).json(results.rows);
        });
    });
};