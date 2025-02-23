const jwt = require('jsonwebtoken');
const pg = require('./pg');
const mongo = require('./mongo');

const secretKey = 'smartEduSuite';

const createToken = (idUser, correoUser) => {
    const payload = {
        id: idUser,
        correo: correoUser
    }

    const options = {
        expiresIn: '1h'
    }

    return jwt.sign(payload, secretKey, options);
}


const validateToken = (id, token, callback) => {
    const query = 'SELECT token FROM usuario WHERE id = $1';

    pg.query(query, [id], (err, results) => {
        if (err) {
            return callback({ valid: false, error: 'Error en el servidor' });
        }

        if (results.rows.length === 0) {
            return callback({ valid: false, error: 'Usuario no encontrado' });
        }

        const storedToken = results.rows[0].token;

        if (!storedToken) {
            return callback({ valid: false, error: 'Token no encontrado' });
        }

        if (storedToken !== token) {
            return callback({ valid: false, error: 'Token no coincide' });
        }

        try {
            const decoded = jwt.verify(token, secretKey);
            return callback({ valid: true, decoded });
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                const updateQuery = 'UPDATE usuario SET token = NULL WHERE id = $1';
                pg.query(updateQuery, [id], (updateErr) => {
                    if (updateErr) {
                        return callback({ valid: false, error: 'Error al actualizar el token en la base de datos' });
                    }
                    return callback({ valid: false, error: 'Token expirado' });
                });
            } else {
                return callback({ valid: false, error: err.message });
            }
        }
    });
};


module.exports = {
    createToken,
    validateToken
}