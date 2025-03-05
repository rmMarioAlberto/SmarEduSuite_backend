const jwtConfig = require('../../config/jwtConfig');
const db = require('../../config/pg');

exports.loginMovil = (req, res) => {

    const { correo, contra } = req.body;

    if (!correo) {
        return res.status(400).json({ message: 'El correo es requerido' });
    }

    if (!contra) {
        return res.status(400).json({ message: 'La contraseña es requerida' });
    }

    const query = 'SELECT id, nombre, "apellidoMa", "apellidoPa", contra, correo, tipo, status, huella, "idGoogle", "idGrupo", token_movil FROM usuario WHERE correo = $1 AND status = 1';
    const query2 = 'UPDATE usuario SET token_movil = $1 WHERE id = $2';

    db.query(query, [correo], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error en el servidor : 1' });
        }
        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado : 1' });
        }


        const user = results.rows[0];
        const filteredUser = {
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

        if (user.tipo === 3) {
            return res.status(403).json({ message: 'No tienes permisos para acceder a esta aplicación' });
        }
        // Utilizar la función createToken en lugar de jwt.sign
        const tokenMovil = jwtConfig.createToken(user.id, user.correo);

        if (user.contra === null) {
            db.query(query2, [tokenMovil, user.id], (err, results) => {
                if (err) {
                    return res.status(500).json({ message: 'Error en el servidor : 2' });
                }
                if (results.rowCount === 0) {
                    return res.status(404).json({ message: 'Usuario no encontrado : 2' });
                }
                return res.status(300).json({ message: "Primer login", user: filteredUser, tokenMovil });
            });
        } else {
            if (user.contra !== contra) {
                return res.status(401).json({ message: 'Contraseña incorrecta : 1' });
            }
            db.query(query2, [tokenMovil, user.id], (err, results) => {
                if (err) {
                    return res.status(500).json({ message: 'Error en el servidor : 2' });
                }
                if (results.rowCount === 0) {
                    return res.status(404).json({ message: 'Usuario no encontrado : 2' });
                }
                return res.status(200).json({ message: 'Login exitoso', user: filteredUser, tokenMovil });
            });
        }
    });
};

exports.changePassword = (req, res) => {
    const { NewPassword, id } = req.body;

    if (!NewPassword) {
        return res.status(400).json({ message: 'Nueva contraseña es requerida' });
    }

    const query = 'UPDATE usuario SET contra = $1 WHERE id = $2';

    db.query(query, [NewPassword, id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        if (results.rowCount === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        return res.status(200).json({ message: 'Contraseña cambiada exitosamente' });
    });
}