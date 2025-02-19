const jwt = require('jsonwebtoken');
const db = require('../../config/pg');

//Consulta tadas las materias
exports.getMaterias = (req, res) => {
    const query = 'SELECT * FROM materia';

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error en el servidor' });
        }

        return res.status(200).json(results.rows);
    }
    )
}

//consulta materias por id
exports.getMateriaById = (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Id de materia es requerido' });
    }

    const query = 'SELECT * FROM materia WHERE id = $1';

    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error en el servidor' });
        }

        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'Materia no encontrada' });
        }

        if (results.rows.length > 1) {
            return res.status(500).json({ message: 'Error en la base de datos' });
        }

        if (results.rows.length === 1) {
            return res.status(200).json(results.rows[0]);
        }
    }
    )
}

//Agrega materias

exports.addMateria = (req, res) => {
    const { nombre, status } = req.body;

    if (!nombre || !status) {
        return res.status(400).json({ message: 'Nombre y status de materia son requeridos' });
    }

    const query = 'INSERT INTO materia (nombre,status) values ($1,$2)';

    db.query(query, [nombre, status], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error en el servidor' });
        }

        return res.status(200).json({ message: 'Materia agregada exitosamente' });
    })
}

//actualiza materias

exports.updateMateria = (req, res) => {
    const { nombre, status, id } = req.body;

    if (!nombre || !status || !id) {
        return res.status(400).json({ message: 'Nombre, status e id de materia son requeridos' });
    }

    const query = 'UPDATE materia SET nombre = $1, status = $2 WHERE id = $3';

    db.query(query, [nombre, status, id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error en el servidor' });
        }

        if (results.rowCount === 0) {
            return res.status(404).json({ message: 'Materia no encontrada' });
        }

        return res.status(200).json({ message: 'Materia actualizada exitosamente' });
    })
}

//buscar materias

exports.searchMateria = (req, res) => {
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ message: 'Nombre de materia es requerido' });
    }

    const query = 'SELECT * FROM materia WHERE nombre ILIKE $1';
    const searchValue = `%${nombre}%`;

    db.query(query, [searchValue], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error en el servidor' });
        }

        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'Materia no encontrada' });
        }

        return res.status(200).json(results.rows);
    }
    )
} 