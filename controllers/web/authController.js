const db = require('../../config/pg');
const jwtControl = require('../../config/jwtConfig');

exports.login = (req, res) => {
    const { correo, contra } = req.body;

    if (!correo) {
        return res.status(400).json({ message: 'Correo es requerido : 0' });
    }

    if (!contra) {
        return res.status(400).json({ message: 'Contraseña es requerida : 0' });
    }

    const query = 'SELECT id,nombre, apellidoMa, apellidoPa FROM usuario WHERE correo = $1';
    const query2 = 'UPDATE usuario SET token = $1 WHERE id = $2';

    db.query(query, [correo], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error en el servidor : 1' });
        }

        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado : 1' });
        }

        const user = results.rows[0];

        if (user.contra !== contra) {
            return res.status(401).json({ message: 'Contraseña incorrecta : 1' });
        }

        const token = jwtControl.createToken(user.id, user.correo);

        db.query(query2, [token, user.id], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor : 2' });
            }

            if (results.rowCount === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado : 2' });
            }

            if (user.contra === '') {
                return res.status(200).json({ message: 'Primer login : 2', token: true });
            }

            return res.status(200).json({ message: 'Login exitoso : 2', user, token: true });
        });
    });
};


exports.changePassword = (req, res) => {
    const { newPassword, id, token } = req.body;

    if(!token){
        return res.status(400).json({ message: 'Token es requerido' });
    }

    if(jwtControl.validateToken(token) == valid.false){
        return res.status(401).json({ message: 'Token invalido' });
    }else{

        if (!newPassword) {
            return res.status(400).json({ message: 'Nueva contraseña es requerida' });
        }
    
        if(!id){
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
    }
};
