const jwt = require('jsonwebtoken');
const pg = require('./pg');
const mongo = require('./mongo');

const secretKey = 'aquí estaba mi clave secreta';

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


const validateTokenMovil = (id, tokenMovil, callback) => {
    const query = 'SELECT token_movil FROM usuario WHERE id = $1';

    pg.query(query, [id], (err, results) => {
        if (err) {
            return callback({ valid: false, error: 'Error en el servidor' });
        }

        if (results.rows.length === 0) {
            return callback({ valid: false, error: 'Usuario no encontrado' });
        }

        const storedTokenMovil = results.rows[0].token_movil;

        if (!storedTokenMovil) {
            return callback({ valid: false, error: 'Token móvil no encontrado' });
        }

        if (storedTokenMovil !== tokenMovil) {
            return callback({ valid: false, error: 'Token móvil no coincide' });
        }

        try {
            const decoded = jwt.verify(tokenMovil, secretKey);
            return callback({ valid: true, decoded });
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                const updateQuery = 'UPDATE usuario SET token_movil = NULL WHERE id = $1';
                pg.query(updateQuery, [id], (updateErr) => {
                    if (updateErr) {
                        return callback({ valid: false, error: 'Error al actualizar el token móvil en la base de datos' });
                    }
                    return callback({ valid: false, error: 'Token móvil expirado' });
                });
            } else {
                return callback({ valid: false, error: err.message });
            }
        }
    });
};


module.exports = {
    createToken,
    validateToken,
    validateTokenMovil
}