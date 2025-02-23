const db = require('../../config/pg');
const jwtControl = require('../../config/jwtConfig');

exports.login = (req, res) => {
    const { correo, contra } = req.body;

    if (!correo) {
<<<<<<< HEAD
        return res.status(400).json({ message: 'El correo es requerido' });
    }

    if (!contra) {
        return res.status(400).json({ message: 'La contraseña es requerida' });
=======
        return res.status(400).json({ message: 'Correo es requerido : 0' });
>>>>>>> pruebas
    }

    if (!contra) {
        return res.status(400).json({ message: 'Contraseña es requerida : 0' });
    }

    const query = 'SELECT id, nombre, "apellidoMa", "apellidoPa", contra, correo, tipo, status, huella, "idGoogle", "idGrupo", token FROM usuario WHERE correo = $1';
    const query2 = 'UPDATE usuario SET token = $1 WHERE id = $2';

    db.query(query, [correo], (err, results) => {

        if (err) {
            return res.status(500).json({ message: 'Error en el servidor : 1' });
        }

        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado : 1' });
        }

        const user = results.rows[0];
<<<<<<< HEAD
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

        const token = jwt.sign({ id: user.id, correo: user.correo }, secretKey, { expiresIn: '1h' });

        if (user.status === 0) {
            return res.status(301).json({ message: "Usuario deshabilitado" });
        }

        if (user.contra === null) {
            return res.status(300).json({ message: "Primer login", user: filteredUser, token });
        }
=======
>>>>>>> pruebas

        if (user.contra !== contra) {
            return res.status(401).json({ message: 'Contraseña incorrecta : 1' });
        }

<<<<<<< HEAD
        return res.status(200).json({ message: 'Login exitoso', user: filteredUser, token });
=======
        const token = jwtControl.createToken(user.id, user.correo);

        db.query(query2, [token, user.id], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor : 2' });
            }

            if (results.rowCount === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado : 2' });
            }

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

            if (user.contra === '') {
                return res.status(200).json({ message: 'Primer login : 2', user: filteredUser, token });
            }

            return res.status(200).json({ message: 'Login exitoso : 2', user: filteredUser, token });
        });
>>>>>>> pruebas
    });
};

exports.changePassword = (req, res) => {
    const { newPassword, id, token } = req.body;

<<<<<<< HEAD
    if (!id) {
        return res.status(400).json({ message: 'El id es requerido' });
    }

    if (!newPassword) {
        return res.status(400).json({ message: 'La nueva contraseña es requerida' });
    }

    const query = 'UPDATE usuario SET contra = $1 WHERE id = $2';

    db.query(query, [newPassword, id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error en el servidor' });
=======
    if (!token) {
        return res.status(400).json({ message: 'Token es requerido' });
    }

    jwtControl.validateToken(id, token, (result) => {
        if (!result.valid) {
            return res.status(401).json({ message: result.error });
>>>>>>> pruebas
        }

        if (!newPassword) {
            return res.status(400).json({ message: 'Nueva contraseña es requerida' });
        }

        if (!id) {
            return res.status(400).json({ message: 'Id es requerido' });
        }

        const query = 'UPDATE usuario SET contra = $1 WHERE id = $2';
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