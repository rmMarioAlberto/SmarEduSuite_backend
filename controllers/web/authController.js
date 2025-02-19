const jwt = require('jsonwebtoken');
const db = require('../../config/pg');

const secretKey = 'smartEduSuite';

exports.login = (req, res) => {
    const { correo, contra } = req.body;

    if (!correo) {
        return res.status(400).json({ message: 'El correo es requerido' });
    }

    if (!contra) {
        return res.status(400).json({ message: 'La contraseña es requerida' });
    }

    const query = 'SELECT * FROM usuario WHERE correo = $1';
    db.query(query, [correo], (err, results) => {

        if (err) {
            return res.status(500).json({ message: 'Error en el servidor' });
        }

        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
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

        if (user.contra === null) {
            return res.status(300).json({ message: "Primer login", user: filteredUser });
        }

        if (user.contra !== contra) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: user.id, correo: user.correo }, secretKey, { expiresIn: '1h' });

        return res.status(200).json({ message: 'Login exitoso', user: filteredUser, token });
    });
};

exports.changePassword = (req, res) => {
    const { newPassword, id } = req.body;

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
        }

        if (results.rowCount === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        return res.status(200).json({ message: 'Contraseña cambiada exitosamente' });
    });
};
