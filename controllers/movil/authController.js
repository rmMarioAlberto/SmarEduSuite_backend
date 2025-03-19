const jwtConfig = require('../../config/jwtConfig');
const db = require('../../config/pg');

exports.loginMovil = (req, res) => {
    console.log("Entró al login")
    const { correo, contra } = req.body;

    if (!correo) {
        return res.status(400).json({ message: 'El correo es requerido' });
    }

    if (!contra) {
        return res.status(400).json({ message: 'La contraseña es requerida' });
    }

    const query = 'SELECT id, nombre, "apellidoMa", "apellidoPa", contra, correo, tipo, status, huella, "idGoogle", "idGrupo", token_movil FROM usuario WHERE correo = $1 AND status = 1';

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

        if (user.tipo === 3) {
            return res.status(403).json({ message: 'No tienes permisos para acceder a esta aplicación' });
        }


        // Para pruebas.
        console.log('Usuario encontrado:', user);
        console.log('Token movil actual:', user.token_movil);


        // Validar el token actual
        jwtConfig.validateTokenMovil(user.id, user.token_movil, (result) => {

            console.log('Resultado de la validación de tokenMovil:', result);
            
            /*
            if (result.valid) {
                return res.status(409).json({ message: 'Ya hay una sesión activa' });
            } 
            */

            if (user.contra === null) {
                const tokenmovil = jwtConfig.createToken(user.id, user.correo);
                const query2 = 'UPDATE usuario SET token_movil = $1 WHERE id = $2';

                db.query(query2, [tokenmovil, user.id], (err, results) => {
                    if (err) {
                        return res.status(500).json({ message: 'Error en el servidor' });
                    }
                    if (results.rowCount === 0) {
                        return res.status(404).json({ message: 'Usuario no encontrado' });
                    }
                    return res.status(300).json({ message: "Primer login", user: filteredUser, tokenmovil });
                });

            } else {
                if (user.contra !== contra) {
                    return res.status(401).json({ message: 'Contraseña incorrecta' });
                }

                const tokenMovil = jwtConfig.createToken(user.id, user.correo);
                const query2 = 'UPDATE usuario SET token_movil = $1 WHERE id = $2';

                db.query(query2, [tokenMovil, user.id], (err, results) => {
                    if (err) {
                        return res.status(500).json({ message: 'Error en el servidor' });
                    }
                    if (results.rowCount === 0) {
                        return res.status(404).json({ message: 'Usuario no encontrado' });
                    }
                    return res.status(200).json({ message: 'Login exitoso', user: filteredUser, tokenMovil });
                });
            }
        });
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

exports.logout = (req,res) => {
    const {idUsuario, token} = req.body;

    if (!idUsuario) {
        return res.status(400).json({message : 'El id de usuario es necesario'})
    }
    if (!token) {
        return res.status(400).json({message : 'El token de usuario es necesario'})
    }

    jwtControl.validateToken(idUsuario,token, (results) => {
        if (!results.valid) {
            return res.status(401).json({message : 'El token no es valido o esta vencido'})
        }

        const query = 'UPDATE usuario SET token = null WHERE id = $1'

        db.query(query, [idUsuario], (err,results) => {
            if (err) {
                return res.status(500).json({message : 'Error en el servidor', err})
            }

            if(results.rowCount === 0){
                return res.status(500).json({message : "No se puedo hacer el logout"})
            }

            return res.status(200).json({message :'Logout exitoso'})
        })
    })
}