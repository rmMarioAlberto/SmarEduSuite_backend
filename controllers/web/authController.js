const db = require('../../config/pg');
const jwt = require('jsonwebtoken');
const jwtControl = require('../../config/jwtConfig');
const { response } = require('express');

const secretKey = 'smartEduSuite';

exports.login = (req, res) => {
    const { correo, contra } = req.body;

    if (!correo) {
        return res.status(400).json({ message: 'El correo es requerido' });
    }
    if (!contra) {
        return res.status(400).json({ message: 'La contraseña es requerida' });
    }

    const query = 'SELECT id, nombre, "apellidoMa", "apellidoPa", contra, correo, tipo, status, huella, "idGoogle", "idGrupo", token FROM usuario WHERE correo = $1 AND status = 1';
    const query2 = 'UPDATE usuario SET token = $1 WHERE id = $2';

    db.query(query, [correo], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error en el servidor : 1' });
        }

        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado : 1' });
        }

        const user = results.rows[0];
        const filteredUser  = {
            id: user.id,
            nombre: user.nombre,
            apellidoMa: user.apellidoMa,
            apellidoPa: user.apellidoPa,
            correo: user.correo,
            tipo: user.tipo,
            status: user.status,
            huella: user.huella,
            idGoogle: user.idGoogle,
            idGrupo: user.idGrupo
        };

        if (user.status === 0) {
            return res.status(301).json({ message: "Usuario deshabilitado" });
        }
        if (user.tipo === 1) {
            return res.status(403).json({ message: 'No tienes permisos para acceder a esta aplicación' });
        }

        // Verificar la contraseña
        if (user.contra !== null && user.contra !== contra) {
            return res.status(401).json({ message: 'Contraseña incorrecta : 1' });
        }

        // Verificar el token
        if (user.token) {
            try {
                jwt.verify(user.token, secretKey);
                return res.status(403).json({ message: 'Ya hay una sesión activa' });
            } catch (error) {
                if (error.name === 'TokenExpiredError') {
                    // Token expirado, intenta generar uno nuevo
                    const newToken = jwt.sign({ id: user.id, correo: user.correo }, secretKey, { expiresIn: '1h' });
                    db.query(query2, [newToken, user.id], (err, results) => {
                        if (err) {
                            return res.status(500).json({ message: 'Error en el servidor : 2' });
                        }
                        return res.status(200).json({ message: 'Token expirado, nuevo token generado', user: filteredUser , token: newToken });
                    });
                } else {
                    return res.status(500).json({ message: 'Error en el servidor', error: error.message });
                }
            }
        } else {
            // Generar un nuevo token si no hay token existente
            const token = jwt.sign({ id: user.id, correo: user.correo }, secretKey, { expiresIn: '1h' });
            db.query(query2, [token, user.id], (err, results) => {
                if (err) {
                    return res.status(500).json({ message: 'Error en el servidor : 2' });
                }
                return res.status(200).json({ message: 'Login exitoso', user: filteredUser , token });
            });
        }
    });
};

exports.changePassword = (req, res) => {
    const { newPassword, id, token } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'El id es requerido' });
    }

    if (!newPassword) {
        return res.status(400).json({ message: 'La nueva contraseña es requerida' });
    }

    jwtControl.validateToken(id, token, (result) => {
        if (!result.valid) {
            return res.status(401).json({ message: result.error });
        }

        const query = 'UPDATE usuario SET contra = $1, token = null WHERE id = $2';
        db.query(query, [newPassword, id], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            if (results.rowCount === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            return res.status(200).json({ message: 'Contraseña cambiada exitosamente' });
        });
    });
};


exports.loginGoogle = (req, res) => {
    const { correo, idGoogle } = req.body;

    if (!correo || !idGoogle) {
        return res.status(400).json({ message: 'El correo y el ID de Google son requeridos' });
    }

    const query = 'SELECT * FROM usuario WHERE correo = $1 AND status = 1';

    db.query(query, [correo], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error en el servidor', err });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = result.rows[0];

        // Filtrar los datos del usuario
        const filteredUser  = {
            id: user.id,
            nombre: user.nombre,
            apellidoMa: user.apellidoMa,
            apellidoPa: user.apellidoPa,
            correo: user.correo,
            tipo: user.tipo,
            status: user.status,
            huella: user.huella,
            idGoogle: user.idGoogle,
            idGrupo: user.idGrupo
        };

        // Verificar el token
        if (user.token) {
            try {
                jwt.verify(user.token, secretKey);
                return res.status(403).json({ message: 'Ya hay una sesión activa' });
            } catch (error) {
                if (error.name === 'TokenExpiredError') {
                    // Token expirado, intenta generar uno nuevo
                    const newToken = jwt.sign({ id: user.id, correo: user.correo }, secretKey, { expiresIn: '1h' });
                    const shouldUpdateIdGoogle = !user.idGoogle || user.idGoogle !== idGoogle;

                    // Construir la consulta de actualización
                    let query2;
                    let params;

                    if (shouldUpdateIdGoogle) {
                        query2 = 'UPDATE usuario SET "idGoogle" = $1, token = $2 WHERE id = $3';
                        params = [idGoogle, newToken, user.id];
                    } else {
                        query2 = 'UPDATE usuario SET token = $1 WHERE id = $2';
                        params = [newToken, user.id];
                    }

                    db.query(query2, params, (updateErr) => {
                        if (updateErr) {
                            return res.status(500).json({
                                message: shouldUpdateIdGoogle ?
                                    'Error al actualizar el ID de Google y token' :
                                    'Error al actualizar el token',
                                err: updateErr
                            });
                        }

                        return res.status(200).json({
                            message: shouldUpdateIdGoogle ?
                                'Login exitoso y datos actualizados' :
                                'Login exitoso',
                            user: filteredUser ,
                            token: newToken
                        });
                    });
                } else {
                    return res.status(500).json({ message: 'Error en el servidor', error: error.message });
                }
            }
        } else {
            // Generar un nuevo token si no hay token existente
            const token = jwt.sign({ id: user.id, correo: user.correo }, secretKey, { expiresIn: '1h' });
            const shouldUpdateIdGoogle = !user.idGoogle || user.idGoogle !== idGoogle;

            // Construir la consulta de actualización
            let query2;
            let params;

            if (shouldUpdateIdGoogle) {
                query2 = 'UPDATE usuario SET "idGoogle" = $1, token = $2 WHERE id = $3';
                params = [idGoogle, token, user.id];
            } else {
                query2 = 'UPDATE usuario SET token = $1 WHERE id = $2';
                params = [token, user.id];
            }

            db.query(query2, params, (updateErr) => {
                if (updateErr) {
                    return res.status(500).json({
                        message: shouldUpdateIdGoogle ?
                            'Error al actualizar el ID de Google y token' :
                            ' Error al actualizar el token',
                        err: updateErr
                    });
                }

                return res.status(200).json({
                    message: shouldUpdateIdGoogle ?
                        'Login exitoso y datos actualizados' :
                        'Login exitoso',
                    user: filteredUser ,
                    token
                });
            });
        }
    });
};

exports.logout = (req, res) => {
    const { idUsuario, token } = req.body;

    if (!idUsuario) {
        return res.status(400).json({ message: 'El id de usuario es necesario' });
    }
    if (!token) {
        return res.status(400).json({ message: 'El token de usuario es necesario' });
    }

    jwtControl.validateToken(idUsuario, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: 'El token no es válido o está vencido' });
        }

        const query = 'UPDATE usuario SET token = null WHERE id = $1';

        db.query(query, [idUsuario], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor', err });
            }

            if (results.rowCount === 0) {
                return res.status(404).json({ message: "No se pudo hacer el logout" }); 
            }

            return res.status(200).json({ message: 'Logout exitoso' });
        });
    });
};