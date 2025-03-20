const jwtControl = require('../../config/jwtConfig');
const db = require('../../config/pg');

exports.getProfile = (req,res) => {
    const {idUsuario, token} = req.body;

    if (!idUsuario) {
        return res.status(400).json({ message: 'El idUsuario es requerido' });
    }

    if (!token) {
        return res.status(400).json({ message: 'EL token es requerido' });
    }

    jwtControl.validateTokenMovil(idUsuario,token, (results) => {
        if (!results.valid) {
            return res.status(401).json({message : 'El token no es valido'})
        }
    })
}