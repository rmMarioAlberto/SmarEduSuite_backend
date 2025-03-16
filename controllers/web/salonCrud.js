const jwtControl = require('../../config/jwtConfig')
const db = require('../../config/pg');

// Primero empezmaos obteniendo el id del usuario y el token. 
// Luego validamos el token con la funcion validateToken de jwtControl. 
// Si el token no es válido, entonces se regresa un mensaje de error.
exports.getSalon = (req, res) => {
    const { id, token } = req.body;

    jwtControl.validateToken(id, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        // Si el token es válido, entonces se ejecuta la consulta 
        // para obtener todas las materias. ;)
        const query = 'SELECT * FROM salon';


        // Si hay un error en la consulta, se regresa un mensaje de error. 
        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            // Si la consulta es exitosa, devolveremos los salones en formato JSON.
            return res.status(200).json(results.rows);
        });
    });
};

// Para consultar los salones por id. Recibe el id y el token del usuario.
exports.getMateriaById = (req, res) => {
    const { idMateria, idUsuario, token } = req.body;

    jwtControl.validateToken(idUsuario, token, (results) => {
        // Primero validamos el token. Si el token no es válido, se regresa un mensaje de error.
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        // Si el token es válido, entonces se valida que esté el id de la materia.
        if (!idMateria) {
            return res.status(400).json({ message: 'Id de materia es requerido' });
        }

        const query = 'SELECT * FROM salon';

        db.query(query, [idSalon], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            if (results.rows.length === 0) {
                return res.status(404).json({ message: 'Materia no encontrada' });
            }

            // Si todo sale bien, regresa el salón en formato JSON.
            return res.status(200).json(results.rows[0]);
        });
    });
};

// Agregar nuevos salones.
exports.addSalon = (req, res) => {
    const { nombre, edificio, status, idUsuario, token } = req.body;

    jwtControl.validateToken(idUsuario, token, (results) => {
        // Primero validamos el token. Si el token no es válido, se regresa un mensaje de error.
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        if (!nombre) {
            return res.status(400).json({ message: 'El nombre del salón es requerido.' });
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
        });
    });
};

