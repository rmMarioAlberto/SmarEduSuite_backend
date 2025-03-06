const jwtControl = require('../../config/jwtConfig');
const db = require('../../config/pg')

exports.getSalon = (req, res) => {
    const { token, idUsuario } = req.body;

    if (!idUsuario) {
        return res.status(400).json({ message: "id de usuario es necesario" })
    }
    if (!token) {
        return res.status(400).json({ message: "token de usuario es necesario" })
    }

    jwtControl.validateToken(idUsuario, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        const query = 'SELECT * FROM salon';

        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            if (results.rowCount === 0) {
                return res.status(500).json({ message: 'Salones no encontrado' });
            }

            return res.status(200).json(results.rows);
        });
    });
}

exports.getSalonById = (req, res) => {
    const { idSalon, token, idUsuario } = req.body;

    if (!idUsuario) {
        return res.status(400).json({ message: "id de usuario es necesario" })
    }
    if (!token) {
        return res.status(400).json({ message: "token de usuario es necesario" })
    }

    jwtControl.validateToken(idUsuario, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        if (!idSalon) {
            return res.status(400).json({ message: "el id del salon es necesario" })
        }

        const query = "SELECT * FROM salon WHERE id = $1";

        db.query(query, [idSalon], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            if (results.rowCount === 0) {
                return res.status(500).json({ message: 'Salon no encontrado' });
            }

            return res.status(200).json(results.rows);
        })

    });
}

exports.addSalon = (req, res) => {
    const { nombre, edificio, status,  token, idUsuario } = req.body;

    if (!idUsuario) {
        return res.status(400).json({ message: "id de usuario es necesario" })
    }
    if (!token) {
        return res.status(400).json({ message: "token de usuario es necesario" })
    }

    jwtControl.validateToken(idUsuario, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        if (!nombre) {
            return res.status(400).json({ message: "nombre es necesario" })
        }
        if (!edificio) {
            return res.status(400).json({ message: "edificio es necesario" })
        }
        if (!status) {
            return res.status(400).json({ message: "status es necesario" })
        }

        const query = 'INSERT INTO salon (nombre, edificio, status) VALUES ($1,$2,$3)';

        db.query(query, [nombre, edificio, status], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            return res.status(200).json({ message: 'salon agregada exitosamente' });
        })
    });
}

exports.updateSalon = (req, res) => {
    const { idSalon, nombre, edificio,status, token, idUsuario } = req.body;

    if (!idUsuario) {
        return res.status(400).json({ message: "id de usuario es necesario" });
    }
    if (!token) {
        return res.status(400).json({ message: "token de usuario es necesario" });
    }

    jwtControl.validateToken(idUsuario, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        if (!nombre) {
            return res.status(400).json({ message: "nombre es necesario" });
        }
        if (!edificio) {
            return res.status(400).json({ message: "edificio es necesario" });
        }
        if (!status) {
            return res.status(400).json({ message: "status es necesario" });
        }
        if (!idSalon) {
            return res.status(400).json({ message: "el id de salon es necesario" });
        }

        const query = 'UPDATE salon SET nombre = $1, edificio = $2, status = $3 WHERE id = $4';

        db.query(query, [nombre, edificio,status, idSalon], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            if (results.rowCount === 0) {
                return res.status(404).json({ message: 'Salon no encontrado' });
            }

            return res.status(200).json({ message: 'Salon actualizado exitosamente' });
        });
    });
};

exports.searchSalon = (req, res) => {
    const { nombre, token, idUsuario } = req.body;

    if (!idUsuario) {
        return res.status(400).json({ message: "id de usuario es necesario" });
    }
    if (!token) {
        return res.status(400).json({ message: "token de usuario es necesario" });
    }

    jwtControl.validateToken(idUsuario, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        if (!nombre) {
            return res.status(400).json({ message: "el nombre del salón es necesario" });
        }

        const query = "SELECT * FROM salon WHERE nombre ILIKE $1"; // Usamos ILIKE para búsqueda insensible a mayúsculas

        db.query(query, [`%${nombre}%`], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            if (results.rowCount === 0) {
                return res.status(404).json({ message: 'No se encontraron salones' });
            }

            return res.status(200).json(results.rows);
        });
    });
};