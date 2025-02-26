const jwtControl = require('../../config/jwtConfig')
const db = require('../../config/pg');

exports.getMaestro = (req, res) => {
    const { id, token } = req.body;

    // Validar que id y token estén presentes
    if (!id || !token) {
        return res.status(400).json({ message: "ID y token son requeridos" });
    }

    jwtControl.validateToken(id, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        const query = 'SELECT "id","nombre","apellidoMa","apellidoPa","correo","tipo","status","huella" FROM usuario WHERE tipo = 2';

        db.query(query, (err, results) => {
            if (err) {
                console.error("Error en la consulta:", err);
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            return res.status(200).json(results.rows);
        });
    });
};

// Consulta maestro por id
exports.getMaestroById = (req, res) => {
    const { idMaestro, idUsuario, token } = req.body;

    jwtControl.validateToken(idUsuario, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        if (!idMaestro) {
            return res.status(400).json({ message: 'Id de maestro es requerido' });
        }

        const query = 'SELECT "id","nombre","apellidoMa","apellidoPa","correo","contra","tipo","status","huella" FROM usuario WHERE id = $1';

        db.query(query, [idMaestro], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            if (results.rows.length === 0) {
                return res.status(404).json({ message: 'Maestro no encontrado' });
            }

            return res.status(200).json(results.rows[0]);
        });
    });
};

// Agrega maestro
exports.addMaestro = (req, res) => {
    const { nombre, apellidoMa, apellidoPa, correo, status, huella, idUsuario, token } = req.body;

    jwtControl.validateToken(idUsuario, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        if (!nombre || !apellidoMa || !apellidoPa || !correo || !status) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        const query = 'INSERT INTO usuario (nombre, "apellidoMa", "apellidoPa", correo, tipo, status, huella) VALUES ($1, $2, $3, $4, 2, $5, $6)';

        db.query(query, [nombre, apellidoMa, apellidoPa, correo, status, huella], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor', err });
            }

            return res.status(200).json({ message: 'Maestro agregado exitosamente' });
        });
    });
};

// Actualiza maestro
exports.updateMaestro = (req, res) => {
    const { idMaestro, nombre, apellidoMa, apellidoPa, correo, status, huella, idUsuario, token } = req.body;

    jwtControl.validateToken(idUsuario, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        if (!idMaestro || !nombre || !apellidoMa || !apellidoPa || !correo || !status) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        // Primero, obtenemos el correo actual del maestro
        const getCorreoQuery = 'SELECT correo FROM usuario WHERE id = $1';
        db.query(getCorreoQuery, [idMaestro], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            if (results.rows.length === 0) {
                return res.status(404).json({ message: 'Maestro no encontrado' });
            }

            const currentCorreo = results.rows[0].correo;

            let query;
            let queryParams;

            if (currentCorreo === correo) {
                query = 'UPDATE usuario SET nombre = $1, "apellidoMa" = $2, "apellidoPa" = $3, status = $4, huella = $5 WHERE id = $6';
                queryParams = [nombre, apellidoMa, apellidoPa, status, huella, idMaestro];
            } else {
                query = 'UPDATE usuario SET nombre = $1, "apellidoMa" = $2, "apellidoPa" = $3, correo = $4, status = $5, huella = $6 WHERE id = $7';
                queryParams = [nombre, apellidoMa, apellidoPa, correo, status, huella, idMaestro];
            }

            console.log('Consulta de actualización:', query);
            console.log('Parámetros de la consulta:', queryParams);

            db.query(query, queryParams, (err, results) => {
                if (err) {
                    console.error('Error al actualizar el maestro:', err);
                    return res.status(500).json({ message: 'Error en el servidor', err });
                }

                if (results.rowCount === 0) {
                    return res.status(404).json({ message: 'Maestro no encontrado' });
                }

                return res.status(200).json({ message: 'Maestro actualizado exitosamente' });
            });
        });
    });
};


// Buscar maestros
exports.searchMaestro = (req, res) => {
    const { nombre, idUsuario, token } = req.body;

    jwtControl.validateToken(idUsuario, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        if (!nombre) {
            return res.status(400).json({ message: 'Nombre de maestro es requerido' });
        }

        const query = 'SELECT "id","nombre","apellidoMa","apellidoPa","correo","contra","tipo","status","huella" FROM usuario WHERE nombre ILIKE $1 OR "apellidoPa" ILIKE $1 OR "apellidoMa" ILIKE $1';
        const searchValue = `%${nombre}%`;

        db.query(query, [searchValue], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            if (results.rows.length === 0) {
                return res.status(404).json({ message: 'Maestro no encontrado' });
            }

            return res.status(200).json(results.rows);
        });
    });
};