const jwt = require('jsonwebtoken');
const db = require('../../config/pg');

const secretKey = 'smartEduSuite';

exports.login = (req, res) => {
    const { correo, contra } = req.body;

    if (!correo || !contra) {
        return res.status(400).json({ message: 'Correo y contraseña son requeridos' });
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

        if (user.contra !== contra) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: user.id, correo: user.correo }, secretKey, { expiresIn: '1h' });

        return res.status(200).json({ message: 'Login exitoso', user, token });
    });
};

exports.changePassword = (req, res) => {
    const { newPassword, id } = req.body;

    if (!newPassword) {
        return res.status(400).json({ message: 'Nueva contraseña es requerida' });
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
